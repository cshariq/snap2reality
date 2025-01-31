const API_KEY: string = "AIzaSyAdJ1GLhQNBPz9Lp69TptrAJuHSQOuTleU";

function deleteFileFromGitHub(path: string, sha: string, callback: () => void): void {
    const repo: string = 'cshariq/snap2reality';
    const token: string = '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';
    const message: string = `Delete ${path}`;

    const url: string = `https://api.github.com/repos/${repo}/contents/${path}`;
    const data: any = {
        message: message,
        sha: sha,
        committer: {
            name: "Shariq Charolia",
            email: "shariq.charolia@gmail.com"
        }
    };

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.commit) {
            callback(); // Call the callback function after deletion
        } else {
            console.error('Failed to delete file:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function uploadToGitHub(filename: string, content: string, path: string, callback: (fileUrl: string) => void): void {
    const repo: string = 'cshariq/snap2reality';
    const message: string = 'Add ' + filename;
    const token: string = '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';

    const url: string = `https://api.github.com/repos/${repo}/contents/data/${path}`;
    const data: any = {
        message: message,
        content: content,
        committer: {
            name: "Shariq Charolia",
            email: "shariq.charolia@gmail.com"
        }
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            console.log('File uploaded successfully:', data.content.html_url);
            callback(data.content.html_url);

        } else {
            console.error('Failed to upload file:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

$(document).ready(function () {
    // Wrap every word in a span
    $('.ml16').each(function () {
        let text: string = $(this).text();
        let words: string[] = text.split(' ');

        // Clear current element
        this.innerHTML = '';

        // Loop through each word, wrap each letter in a span
        for (let word of words) {
            let word_split: string = word.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

            // console.log('<span class="word">' + word_split + '</span>');

            // Wrap another span around each word, add word to header
            this.innerHTML += '<span class="word">' + word_split + '</span>';
        }
    });

    anime.timeline({
    })
        .add({
            targets: '.ml16 .letter',
            translateY: [100, 0],
            easing: "easeOutExpo",
            duration: 1400,
            delay: function (el, i) {
                return 30 * i;
            }
        });
});

$(document).ready(function () {
    // Wrap every word in a span
    $('.ml17').each(function () {
        let text: string = $(this).text();
        let words: string[] = text.split(' ');

        // Clear current element
        this.innerHTML = '';

        // Loop through each word, wrap each letter in a span
        for (let word of words) {
            let word_split: string = word.replace(/([^\x00-\x80]|\w|[%])/g, "<span class='letter'>$&</span>");

            // console.log('<span class="word">' + word_split + '</span>');

            // Wrap another span around each word, add word to header
            this.innerHTML += '<span class="word">' + word_split + '</span>';
        }
    });

    anime.timeline({ delay: 2400 })
        .add({
            targets: '.ml17 .letter',
            translateY: [100, 0],
            easing: "easeOutExpo",
            duration: 1400,
            delay: function (el, i) {
                return 2400 + 30 * i; // Add a 1-second delay before starting the animation
            }
        });
});

document.addEventListener("DOMContentLoaded", function () {
    const dropbox: HTMLElement | null = document.getElementById("dropbox");
    const fileElem: HTMLInputElement | null = document.getElementById("fileElem") as HTMLInputElement;
    if (dropbox) {
        dropbox.addEventListener("dragenter", function (e) {
            dropbox.classList.add('dragover');
        });

        dropbox.addEventListener("dragover", function (e) {
            dropbox.classList.add("dragover");
        });

        dropbox.addEventListener("dragleave", function (e) {
            dropbox.classList.remove("dragover");
        });

        dropbox.addEventListener("drop", function (e) {
            dropbox.classList.remove("dragover");
            const files: FileList | null = e.dataTransfer ? e.dataTransfer.files : null;
            if (files) handleFiles(files);
        });

        dropbox.addEventListener("click", function () {
            if (fileElem) fileElem.click();
        });
    }

    function handleFiles(files: FileList): void {
        const yearlyData: { [year: string]: any[] } = {};
        const upload: void[] = [
            uploadToGemini("Electricity bill", files),
        ];
        const chatSession = model.startChat({ generationConfig });
        const result = chatSession.sendMessage("");
        console.log(result.response.text());
    }
});

function handleFiles(files: FileList): void {
    const file: File = files[0];
    const reader: FileReader = new FileReader();
    console.log(file.type);
    reader.onload = function (event) {
        const content: string | null = event.target?.result?.toString().split(',')[1]; // Get the file content in base64
        const path: string = file.name; // Set the path to the file's name
        const message: string = `Upload ${path}`;
        if (content) {
            uploadToGitHub(message, content, path, function (fileUrl: string) {
                const rawUrl: string = `https://raw.githubusercontent.com/cshariq/HSBDC/main/${fileUrl}`;
                processData(rawUrl);
            });
        }
    };
    reader.readAsDataURL(file);
}

function processData(file: string): void {
    const prompt: any = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": "Here is some text"
                    },
                    {
                        "fileData": {
                            "fileUri": file,
                            "mimeType": "image/png"
                        }
                    }
                ]
            }
        ],
        "systemInstruction": {
            "role": "user",
            "parts": [
                {
                    "text": "If the given text is a country or city return the city or country, if not (for e.g. a continent or demographic) return N/A"
                }
            ]
        },
        "generationConfig": {
            "temperature": 1,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 8192,
            "responseMimeType": "text/plain"
        }
    };
    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + API_KEY, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prompt)
    })
        .then(response => response.json())
        .then(result => {
            const latestModelResponse: string = result.candidates[0].content.parts[0].text;
            console.log(latestModelResponse);
        })
        .catch(error => console.error('Error:', error));
}
