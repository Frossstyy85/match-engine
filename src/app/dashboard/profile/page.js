
import { EmailCard, NameCard, PasswordCard } from "@/app/dashboard/profile/CardComponents";
import "./page.css"
import {getCurrentUser} from "@/lib/auth";

export default async function Profile() {

    const user = await getCurrentUser();

  return (
    <div className="profilePage">
      <div className="profileHeader">
        <h1 className="profileTitle">Profile</h1>
        <p className="profileSubtitle">Manage your account settings.</p>
      </div>
      <div className="cardWrapper">
        <NameCard userName={user.name} />
        <EmailCard userEmail={user.email} />
        <PasswordCard />
      </div>
    </div>
  );
}
