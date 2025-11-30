// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { v4 as uuidv4 } from "uuid";

import type { Session } from "next-auth";

type WithUsername = { username?: string };
type WithLogin = { login?: string };

function getAuthorFromSession(session: Session | null): string {
  // ✅ userが存在しない場合は即Unknownを返す
  if (!session || !session.user) return "Unknown";

  const user = session.user; // ここ以降は user が必ず存在する

  const username =
    (user as WithUsername).username ??
    (user as WithLogin).login ?? // GitHubのloginを載せている場合のフォールバック
    user.name ??
    user.email;

  return username ?? "Unknown";
}

// ----- AWS SDK v3 クライアント（DocumentClient）設定 -----
const baseClient = new DynamoDBClient({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // Vercel の環境変数に設定
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // Vercel の環境変数に設定
  },
});

const docClient = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

const TABLE_NAME = "Posts";

// ----- POST: 新規投稿 -----
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content } = body ?? {};

    // 入力バリデーション
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "title は必須です" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "content は必須です" },
        { status: 400 }
      );
    }

    // ✅ 型安全に author を確定
    const author = getAuthorFromSession(session);

    const now = new Date();
    const item = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      author,
      createdAt: now.toISOString(),
      createdAtEpoch: now.getTime(), // 並び替え用
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        // ConditionExpression: "attribute_not_exists(id)", // 必要なら重複防止
      })
    );

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("DynamoDB 保存エラー:", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}

// ----- GET: 投稿一覧 -----
export async function GET() {
  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );

    const posts = (result.Items ?? []) as Array<{
      id: string;
      title: string;
      content: string;
      author: string;
      createdAt: string;
      createdAtEpoch?: number;
    }>;

    const sorted = posts.sort((a, b) => {
      const ta = a.createdAtEpoch ?? new Date(a.createdAt).getTime();
      const tb = b.createdAtEpoch ?? new Date(b.createdAt).getTime();
      return tb - ta;
    });

    return NextResponse.json(sorted, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}
