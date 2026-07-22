const formatDate = (date: NativeDate) => {
    return date.toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
    });
};

// Generate New Login Detected Email HTML
export const newLoginDetectedHtml = ({
    email,
    loginAt,
    userAgent,
    fullName,
}: {
    email: string;
    loginAt: NativeDate;
    userAgent: string;
    fullName: string;
}) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Login Detected</title>
</head>

<body style="margin:0;padding:0;background:#f5f3ff;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="background:linear-gradient(135deg,#6d28d9,#8b5cf6);padding:35px;color:#ffffff;">
                            <h1 style="margin:0;font-size:28px;">🔐 New Login Detected</h1>
                            <p style="margin-top:10px;font-size:15px;opacity:.9;">
                                We noticed a new login to your account.
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:35px;color:#374151;">

                            <p style="font-size:16px;margin-top:0;">
                                Hello <strong>${fullName}</strong>,
                            </p>

                            <p style="line-height:1.7;">
                                A new login was detected on your account.
                                If this was you, no further action is required.
                                Otherwise, please secure your account immediately.
                            </p>

                            <!-- Login Details -->
                            <table width="100%" cellpadding="10"
                                style="margin:25px 0;background:#faf5ff;border:1px solid #ddd6fe;border-radius:8px;">
                                <tr>
                                    <td><strong>Email</strong></td>
                                    <td>${email}</td>
                                </tr>

                                <tr>
                                    <td><strong>Login Time</strong></td>
                                    <td>${formatDate(loginAt)}</td>
                                </tr>

                                <tr>
                                    <td><strong>Device / Browser</strong></td>
                                    <td>${userAgent}</td>
                                </tr>
                            </table>

                            <!-- Alert Box -->
                            <div
                                style="background:#f3e8ff;border-left:5px solid #7c3aed;padding:18px;border-radius:8px;">
                                <strong style="color:#6d28d9;">Didn't log in?</strong>
                                <p style="margin:10px 0 0;line-height:1.6;">
                                    Change your password immediately and review your recent account activity to
                                    protect your account.
                                </p>
                            </div>

                            <!-- Button -->
                            <div style="text-align:center;margin-top:35px;">
                                <a href="#"
                                    style="background:#7c3aed;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;display:inline-block;">
                                    Secure My Account
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="background:#faf5ff;padding:20px;color:#6b7280;font-size:13px;">
                            <p style="margin:0;">
                                This is an automated security notification.
                            </p>
                            <p style="margin:8px 0 0;">
                                © ${new Date().getFullYear()} Your Company. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</body>
</html>
`;

    return html;
};

// Generate New Account Created Email HTML
export const newAccountCreatedHtml = ({
    fullName,
    email,
}: {
    fullName: string;
    email: string;
}) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Our Platform</title>
</head>

<body style="margin:0;padding:0;background:#f5f3ff;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,0.08);">

    <!-- Header -->
    <tr>
        <td align="center"
        style="background:linear-gradient(135deg,#6d28d9,#8b5cf6);padding:40px;color:#ffffff;">
            <h1 style="margin:0;font-size:30px;">🎉 Welcome!</h1>
            <p style="margin-top:10px;font-size:15px;opacity:.95;">
                Your account has been created successfully.
            </p>
        </td>
    </tr>

    <!-- Body -->
    <tr>
        <td style="padding:35px;color:#374151;">

            <p style="font-size:16px;margin-top:0;">
                Hello <strong>${fullName}</strong>,
            </p>

            <p style="line-height:1.8;">
                Welcome! We're excited to have you join our platform.
                Your account has been successfully created and is now ready to use.
            </p>

            <!-- Account Details -->
            <table width="100%" cellpadding="10"
            style="margin:25px 0;background:#faf5ff;border:1px solid #ddd6fe;border-radius:8px;">
                <tr>
                    <td width="35%"><strong>Name</strong></td>
                    <td>${fullName}</td>
                </tr>

                <tr>
                    <td><strong>Email</strong></td>
                    <td>${email}</td>
                </tr>

                <tr>
                    <td><strong>Status</strong></td>
                    <td style="color:#16a34a;font-weight:bold;">
                        ✅ Active
                    </td>
                </tr>
            </table>

            <!-- Info Box -->
            <div
            style="background:#f3e8ff;border-left:5px solid #7c3aed;padding:18px;border-radius:8px;">
                <strong style="color:#6d28d9;">What's Next?</strong>
                <p style="margin:10px 0 0;line-height:1.6;">
                    You can now sign in to your account, update your profile,
                    and start exploring all the features available to you.
                </p>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin-top:35px;">
                <a href="#"
                style="background:#7c3aed;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;display:inline-block;">
                    Go to Dashboard
                </a>
            </div>

        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td align="center"
        style="background:#faf5ff;padding:20px;color:#6b7280;font-size:13px;">
            <p style="margin:0;">
                Thank you for choosing us. We look forward to serving you!
            </p>

            <p style="margin:8px 0 0;">
                © ${new Date().getFullYear()} Your Company. All rights reserved.
            </p>
        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

    return html;
};