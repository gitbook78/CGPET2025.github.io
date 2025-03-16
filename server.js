const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/save-test', (req, res) => {
    const data = req.body;

    let logEntry = `\n========================\n`;
    logEntry += `Name: ${data.name}\n`;
    logEntry += `Paper: ${data.paper}\n`;
    logEntry += `Started Time: ${data.startedTime}\n`;
    logEntry += `Completed Time: ${data.completedTime}\n`;
    logEntry += `Responses:\n`;

    for (let q in data.responses) {
        logEntry += `  Q${q}: ${data.responses[q]}\n`;
    }
    logEntry += `========================\n`;

    let filePath = `log_${data.paper.replace(/\s+/g, '_')}.txt`; // Paper-wise log
    fs.appendFile(filePath, logEntry, (err) => {
        if (err) {
            console.error("Error saving test:", err);
            return res.status(500).send("Error saving test.");
        }
        res.send("Test saved successfully!");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/mock.html`);
});
