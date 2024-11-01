import { createCompanyExpenseSchema } from "@/dto/expense/create-company-expense";
import { getUserAuth } from "@/lib/auth/utils";
import { formatZodError } from "@/lib/utils";
import APIExpenseService from "@/services/api/expense";
import { NextResponse } from "next/server";

export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const expenses = await APIExpenseService.findAllByCompanyId(session.user.selectedCompany.id);
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  try {
    const body = await request.json();
    const expenseDTO = createCompanyExpenseSchema.safeParse(body);

    if (!expenseDTO.success) {
      return NextResponse.json(formatZodError(expenseDTO.error), { status: 422 });
    }
    const newExpense = await APIExpenseService.create(expenseDTO.data);
    return NextResponse.json(newExpense);
  } catch (error) {
    return NextResponse.json(error instanceof Error ? error.message : "Internal server error", { status: 500 });
  }
}
