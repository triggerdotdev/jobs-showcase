export function weeklySummaryEmail(user: any) {
  return `
    <h1>Weekly summary for ${user.name}</h1>
    <p>Hi ${user.name},</p>
    <p>Here is your weekly summary:</p>
    <ul>
      <li>Number of logins: ${user.logins}</li>
    </ul>
    <p>Thanks,</p>
    <p>The team</p>
  `;
}
