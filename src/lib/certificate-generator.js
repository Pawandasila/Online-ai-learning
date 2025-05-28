import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to generate SVG certificate
function generateCertificateSVG(
  userName,
  courseName,
  completionDate,
  certificateId
) {
  const currentDate = new Date().toLocaleDateString();

  return `
    <svg width="1400" height="1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background Gradient -->
        <radialGradient id="backgroundGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="30%" stop-color="#f8fafc"/>
          <stop offset="70%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </radialGradient>
        
        <!-- Border Gradient -->
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="50%" stop-color="#1d4ed8"/>
          <stop offset="100%" stop-color="#1e40af"/>
        </linearGradient>
        
        <!-- Line Gradient -->
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="10%" stop-color="#3b82f6"/>
          <stop offset="50%" stop-color="#1d4ed8"/>
          <stop offset="90%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>

        <!-- Course Name Background -->
        <linearGradient id="courseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(5, 150, 105, 0.1)"/>
          <stop offset="50%" stop-color="rgba(5, 150, 105, 0.2)"/>
          <stop offset="100%" stop-color="rgba(5, 150, 105, 0.1)"/>
        </linearGradient>

        <!-- Signature Gradient -->
        <linearGradient id="sigGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>

        <!-- Drop Shadow Filter -->
        <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="3" stdDeviation="3" flood-opacity="0.1"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="1400" height="1000" fill="url(#backgroundGrad)"/>
      
      <!-- Texture Pattern -->
      ${Array.from({ length: 35 }, (_, i) =>
        Array.from(
          { length: 25 },
          (_, j) =>
            `<circle cx="${i * 40 + 20}" cy="${
              j * 40 + 20
            }" r="0.5" fill="#64748b" opacity="0.05"/>`
        ).join("")
      ).join("")}

      <!-- Main Border -->
      <rect x="30" y="30" width="1340" height="940" fill="none" stroke="url(#borderGrad)" stroke-width="12"/>
      
      <!-- Inner Borders -->
      <rect x="50" y="50" width="1300" height="900" fill="none" stroke="#60a5fa" stroke-width="4"/>
      <rect x="70" y="70" width="1260" height="860" fill="none" stroke="#93c5fd" stroke-width="2"/>

      <!-- Corner Decorations -->
      <circle cx="150" cy="150" r="30" fill="url(#borderGrad)"/>
      <circle cx="1250" cy="150" r="30" fill="url(#borderGrad)"/>
      <circle cx="150" cy="850" r="30" fill="url(#borderGrad)"/>
      <circle cx="1250" cy="850" r="30" fill="url(#borderGrad)"/>

      <!-- Title with Shadow -->
      <text x="703" y="183" text-anchor="middle" font-family="serif" font-size="72" font-weight="bold" fill="rgba(0,0,0,0.1)">CERTIFICATE</text>
      <text x="700" y="180" text-anchor="middle" font-family="serif" font-size="72" font-weight="bold" fill="#1e40af">CERTIFICATE</text>
      
      <text x="703" y="233" text-anchor="middle" font-family="serif" font-size="42" font-weight="bold" fill="rgba(0,0,0,0.1)">OF COMPLETION</text>
      <text x="700" y="230" text-anchor="middle" font-family="serif" font-size="42" font-weight="bold" fill="#1e40af">OF COMPLETION</text>

      <!-- Decorative Line -->
      <line x1="250" y1="280" x2="1150" y2="280" stroke="url(#lineGrad)" stroke-width="4"/>
      
      <!-- Diamond -->
      <g transform="translate(700,280) rotate(45)">
        <rect x="-8" y="-8" width="16" height="16" fill="#3b82f6"/>
      </g>

      <!-- "This is to certify that" -->
      <text x="700" y="360" text-anchor="middle" font-family="serif" font-size="38" fill="#4b5563">This is to certify that</text>

      <!-- User Name with Shadow -->
      <text x="703" y="443" text-anchor="middle" font-family="serif" font-size="58" font-weight="bold" fill="rgba(0,0,0,0.1)">${userName}</text>
      <text x="700" y="440" text-anchor="middle" font-family="serif" font-size="58" font-weight="bold" fill="#1e40af">${userName}</text>
      
      <!-- Name Underline -->
      <line x1="${700 - userName.length * 15}" y1="470" x2="${
    700 + userName.length * 15
  }" y2="470" stroke="#3b82f6" stroke-width="3"/>

      <!-- Course completion text -->
      <text x="700" y="540" text-anchor="middle" font-family="serif" font-size="38" fill="#4b5563">has successfully completed the course</text>      <!-- Course Name Background -->
      <rect x="200" y="580" width="1000" height="60" fill="url(#courseGrad)" rx="10"/>
      
      <!-- Course Name with Shadow -->
      <text x="703" y="613" text-anchor="middle" font-family="serif" font-size="${Math.max(
        16,
        Math.min(46, 1000 / Math.max(20, courseName.length))
      )}px" font-weight="bold" fill="rgba(0,0,0,0.1)">${courseName}</text>
      <text x="700" y="610" text-anchor="middle" font-family="serif" font-size="${Math.max(
        16,
        Math.min(46, 1000 / Math.max(20, courseName.length))
      )}px" font-weight="bold" fill="#059669">${courseName}</text>

      <!-- Completion Date -->
      <text x="700" y="700" text-anchor="middle" font-family="serif" font-size="32" fill="#6b7280">Completed on ${completionDate}</text>

      <!-- Signature Section -->
      <text x="180" y="800" font-family="serif" font-size="28" font-weight="bold" fill="#374151">Skill Sprint</text>
      <text x="180" y="830" font-family="serif" font-size="22" fill="#6b7280">Authorized</text>
      <line x1="180" y1="850" x2="450" y2="850" stroke="url(#sigGrad)" stroke-width="2"/>

      <!-- Certificate ID -->
      <text x="1220" y="790" text-anchor="end" font-family="serif" font-size="24" font-weight="bold" fill="#374151">Certificate ID:</text>
      <text x="1220" y="820" text-anchor="end" font-family="monospace" font-size="26" font-weight="bold" fill="#3b82f6">${certificateId}</text>
      <text x="1220" y="850" text-anchor="end" font-family="serif" font-size="20" fill="#6b7280">Generated: ${currentDate}</text>

      <!-- Seal -->
      <circle cx="1100" cy="730" r="60" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" stroke-width="3"/>
      <circle cx="1100" cy="730" r="45" fill="none" stroke="#3b82f6" stroke-width="3"/>
      <text x="1100" y="720" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#3b82f6">VERIFIED</text>
      <text x="1100" y="740" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#3b82f6">COMPLETION</text>
    </svg>
  `;
}

export async function generateCertificate(
  userName,
  courseName,
  completionDate
) {
  console.log(userName, courseName, completionDate);

  try {
    // Validate input parameters
    if (!userName || !courseName || !completionDate) {
      throw new Error(
        `Missing required parameters: userName=${userName}, courseName=${courseName}, completionDate=${completionDate}`
      );
    }

    console.log("Generating certificate for:", {
      userName,
      courseName,
      completionDate,
    });

    // Generate unique certificate ID
    const certificateId = `CERT-${Date.now().toString(36).toUpperCase()}`;

    // Generate SVG certificate
    const svgContent = generateCertificateSVG(
      userName,
      courseName,
      completionDate,
      certificateId
    );

    // For Vercel deployment, we'll use a different approach
    // Convert SVG to base64 and use Cloudinary's text overlay feature
    // Or use a third-party service that works in serverless environments

    console.log("SVG certificate generated");

    // Upload SVG to Cloudinary and convert to PNG
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:image/svg+xml;base64,${Buffer.from(svgContent).toString(
          "base64"
        )}`,
        {
          resource_type: "image",
          public_id: `ai-learning-certificate/cert_${userName.replace(
            /\s+/g,
            "_"
          )}_${Date.now()}`,
          format: "png",
          quality: "auto:best",
          fetch_format: "auto",
          flags: "progressive",
          transformation: [
            { width: 1400, height: 1000, crop: "fit", format: "png" },
          ],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log(
              "Certificate uploaded successfully:",
              result.secure_url
            );
            resolve(result);
          }
        }
      );
    });

    return {
      url: uploadResult.secure_url,
      certificateId,
      publicId: uploadResult.public_id,
      width: 1400,
      height: 1000,
    };
  } catch (error) {
    console.error("Certificate generation error:", error);
    throw new Error("Failed to generate certificate: " + error.message);
  }
}
