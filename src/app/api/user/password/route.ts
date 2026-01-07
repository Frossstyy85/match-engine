import { getAuthentication } from "@/lib/auth";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import {JwtUser} from "@/lib/jwt";
import {getPasswordHashById, updatePassword} from "@/db/repositories/UserRepository";

export async function PATCH(req) {
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const user: JwtUser = await getAuthentication();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { password_hash } = await getPasswordHashById(Number(user.sub));
  if (!password_hash) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(currentPassword, password_hash);
  if (!passwordMatches) {
    return NextResponse.json(
      { message: "Current password is incorrect" }, { status: 400 }
    );
  }

  await updatePassword(Number(user.sub), newPassword)

  return NextResponse.json(
    { message: "Password updated successfully" }, { status: 200 }
  );
}