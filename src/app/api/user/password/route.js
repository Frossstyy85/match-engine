import {getAuthentication, getSessionUser} from "@/lib/auth";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import userService from "@/services/userService";

export async function PATCH(req) {
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const auth = await getAuthentication();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const passwordHash = await userService.getPasswordHash(auth.id);
  if (!passwordHash) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(currentPassword, passwordHash);
  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  await userService.updatePassword(newPassword, auth.id);

  return NextResponse.json(
    { message: "Password updated successfully" },
    { status: 200 }
  );
}