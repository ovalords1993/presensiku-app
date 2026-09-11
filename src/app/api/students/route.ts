import { NextResponse } from "next/server";
import { getStudentApiData } from "@/lib/data-source";

export async function GET() {
  const data = await getStudentApiData();

  return NextResponse.json(data);
}
