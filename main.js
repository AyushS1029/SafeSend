/*const {app,BrowserWindow, Menu}= require('electron')
function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height:600,
    })
    win.loadFile("htmls/login.html")
    
}
app.whenReady().then(createWindow)*/
ipcMain.handle('fetch-emails', async () => {
    if (!userTokens) {
        return [];
    }

    try {
        oAuth2Client.setCredentials(userTokens);

        // Fetch Gmail messages
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10, // Fetch 10 emails
        });

        // Map the email data to a more user-friendly format
        const emails = await Promise.all(res.data.messages.map(async (message) => {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
            });

            // Extract relevant information from the email
            const headers = msg.data.payload.headers;
            const fromHeader = headers.find(header => header.name === 'From');
            const from = fromHeader ? fromHeader.value : 'Unknown Sender';

            // Snippet is a preview of the email content
            const snippet = msg.data.snippet;

            // Date is the time the email was sent, you might want to format it
            const timestamp = new Date(parseInt(msg.data.internalDate)).toLocaleString();

            return {
                sender: from,
                snippet: snippet,
                time: timestamp,
            };
        }));

        return emails;
    } catch (error) {
        console.error('Error fetching emails:', error);
        return [];
    }
});
