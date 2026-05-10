// api/update-image.js

import { google } from "googleapis";
import { PassThrough } from "stream";


/* =========================
   GOOGLE AUTH
========================= */

const auth = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
);

auth.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});


/* =========================
   MAIN FUNCTION
========================= */

export default async function handler(req, res){

    try{

        /*
            CREATE DRIVE INSTANCE
        */

        const drive = google.drive({
            version:"v3",
            auth
        });


        /*
            GET DATA FROM FRONTEND
        */

        const {
            fileId,
            type,
            content
        } = req.body;


        /*
            VALIDATION
        */

        if(!fileId){

            return res.status(400).json({
                error:"Missing fileId"
            });

        }


        /*
            REMOVE BASE64 PREFIX
        */

        const base64Data = content.split(",")[1];


        /*
            CONVERT TO BUFFER
        */

        const buffer = Buffer.from(base64Data, "base64");


        /*
            BUFFER -> STREAM
        */

        const stream = new PassThrough();

        stream.end(buffer);


        /*
            UPDATE EXISTING FILE
        */

        await drive.files.update({

            fileId:fileId,

            media:{
                mimeType:type,
                body:stream
            }

        });


        /*
            GENERATE URL
        */

        const url = `https://drive.google.com/thumbnail?id=${fileId}`;


        /*
            SUCCESS RESPONSE
        */

        res.status(200).json({

            message:"Image Updated",

            fileId,

            url

        });


    }catch(error){

        console.log(error);

        res.status(500).json({

            error:error.message

        });

    }

}