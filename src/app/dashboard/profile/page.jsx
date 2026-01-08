import { PasswordCard } from "@/app/dashboard/profile/CardComponents";

export default async function Profile() {

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
