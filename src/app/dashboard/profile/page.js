
import { PasswordCard } from "@/app/dashboard/profile/CardComponents";
import {getUserProfile} from "@/lib/auth";

export default async function Profile() {

    const user = await getUserProfile();

  return (
    <div>
      <div>
        <h1>Profile</h1>
        <p>Manage your account settings.</p>
      </div>
      <div>
        <PasswordCard />
      </div>
    </div>
  );
}
