import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { title, content, author } = await req.json();

    const command = new PutCommand({
      TableName: "Posts",
      Item: {
        id: uuidv4(),
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
      },
    });

    await client.send(command);
    return NextResponse.json({ message: "投稿を保存しました" });
  } catch (error) {
    console.error("DynamoDB 保存エラー:", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: "Posts",
    });

    const result = await client.send(command);
    const posts = result.Items?.map((item) => unmarshall(item)) || [];

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}
