const { cmd, commands } = require('../arslan');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpaijsksnsr", "pairing", "clonebnsjdndnznot"],
    react: "✅",
    desc: "Get pairing code for JUNAID-MD bot",
    category: "download",
    use: ".pair 92323***",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Extract phone number from command
        let phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');
        if (phoneNumber.startsWith('00')) phoneNumber = phoneNumber.slice(2);
        if (phoneNumber.startsWith('0') && phoneNumber.length === 11) phoneNumber = '92' + phoneNumber.slice(1);

        // Validate phone number format
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ Please provide a valid phone number without `+`\nExample: `.pair 92323***`");
        }

        // Make API request to get pairing code
        const response = await axios.get(`http://127.0.0.1:${process.env.PORT || 8000}/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            const msg = response.data?.message || response.data?.error || "Pairing service did not return a code.";
            return await reply(`❌ Failed to retrieve pairing code.\n\n${msg}`);
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *PAIRING COMPLETED*";

        // Send initial message with formatting
        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        // Optional 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send clean code again
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while getting pairing code. Please try again later.");
    }
});

cmd({
    pattern: "pair2",
    alias: ["getpair2", "reqpair", "clonebot2"],
    react: "📉",
    desc: "Get pairing code for JUNAID-MD bot",
    category: "download",
    use: ".pair 92323XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Check if in group
        if (isGroup) {
            return await reply("❌ This command only works in private chat. Please message me directly.");
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Extract phone number
        let phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');
        if (phoneNumber.startsWith('00')) phoneNumber = phoneNumber.slice(2);
        if (phoneNumber.startsWith('0') && phoneNumber.length === 11) phoneNumber = '92' + phoneNumber.slice(1);

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ Invalid phone number format!\n\nPlease use: `.pair 92323000000000`\n(Without + sign)");
        }

        // Get pairing code from API
        const response = await axios.get(`http://127.0.0.1:${process.env.PORT || 8000}/code?number=${encodeURIComponent(phoneNumber)}`);
        
        if (!response.data?.code) {
            const msg = response.data?.message || response.data?.error || "Pairing service did not return a code.";
            return await reply(`❌ Failed to get pairing code.\n\n${msg}`);
        }

        const pairingCode = response.data.code;
        
        // Send image with caption
        const sentMessage = await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/swouod.jpg" },
            caption: `- *⍴ᥲіrіᥒg ᥴ᥆ძᥱ*\n\n Notification has been sent to your WhatsApp. Please check your phone and copy this code to pair it and get your session id.\n\n*🔢 Pairing Code*: *${pairingCode}*\n\n> *Copy it from below message 👇🏻*`
        }, { quoted: m });

        // Send clean code separately
        await reply(pairingCode);
        
        // Add ✅ reaction to the clean code message
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred. Please try again later.");
    }
});
