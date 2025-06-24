import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// DynamoDB クライアントの初期化
const client = new DynamoDBClient({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function extractIdFromRequest(req: NextRequest): string | null {
  const segments = req.nextUrl.pathname.split("/");
  return segments.length > 0 ? segments[segments.length - 1] : null;
}

// GET: 投稿を取得
export async function GET(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) {
    return NextResponse.json(
      { error: "ID が指定されていません" },
      { status: 400 }
    );
  }

  try {
    const command = new GetCommand({
      TableName: "Posts",
      Key: { id },
    });

    const result = await client.send(command);

    if (!result.Item) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.Item);
  } catch (error) {
    console.error("DynamoDB 取得エラー:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// PUT: 投稿を更新
export async function PUT(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) {
    return NextResponse.json(
      { error: "ID が指定されていません" },
      { status: 400 }
    );
  }

  try {
    const { title, content } = await req.json();

    if (!title && !content) {
      return NextResponse.json(
        { error: "更新する内容がありません" },
        { status: 400 }
      );
    }

    let updateExpression = "SET ";
    const expressionAttributeValues: Record<string, unknown> = {};
    const expressionAttributeNames: Record<string, string> = {};
    const updates: string[] = [];

    if (title) {
      updates.push("#T = :title");
      expressionAttributeValues[":title"] = title;
      expressionAttributeNames["#T"] = "title";
    }

    if (content) {
      updates.push("#C = :content");
      expressionAttributeValues[":content"] = content;
      expressionAttributeNames["#C"] = "content";
    }

    updates.push("#UpdatedAt = :updatedAt");
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();
    expressionAttributeNames["#UpdatedAt"] = "updatedAt";

    updateExpression += updates.join(", ");

    const command = new UpdateCommand({
      TableName: "Posts",
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: "ALL_NEW",
    });

    const result = await client.send(command);
    return NextResponse.json({
      message: "投稿を更新しました",
      updatedItem: result.Attributes,
    });
  } catch (error) {
    console.error("DynamoDB 更新エラー:", error);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

// DELETE: 投稿を削除
export async function DELETE(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) {
    return NextResponse.json(
      { error: "ID が指定されていません" },
      { status: 400 }
    );
  }

  try {
    const command = new DeleteCommand({
      TableName: "Posts",
      Key: { id },
    });

    await client.send(command);
    return NextResponse.json({ message: "投稿を削除しました" });
  } catch (error) {
    console.error("DynamoDB 削除エラー:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
