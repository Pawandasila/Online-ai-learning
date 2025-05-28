import { createCanvas, loadImage, registerFont } from 'canvas';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to register fonts safely
function registerFontsSafely() {
  try {
    // Skip font registration in production environments
    // node-canvas works with system fonts by default
    console.log('Using system default fonts for certificate generation');
    
    // Note: We'll use generic font family names (serif, sans-serif, monospace)
    // which are always available in node-canvas
  } catch (error) {
    console.log('Font registration failed, using default fonts:', error);
  }
}

export async function generateCertificate(userName, courseName, completionDate) {
  try {
    // Validate input parameters
    if (!userName || !courseName || !completionDate) {
      throw new Error(`Missing required parameters: userName=${userName}, courseName=${courseName}, completionDate=${completionDate}`);
    }

    // Register fonts safely
    registerFontsSafely();

    console.log('Generating certificate for:', { userName, courseName, completionDate });

    // Create canvas with higher resolution for better quality
    const canvas = createCanvas(1400, 1000);
    const ctx = canvas.getContext('2d');

    // Enable anti-aliasing for smoother text
    ctx.textBaseline = 'middle';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Create sophisticated background gradient
    const backgroundGradient = ctx.createRadialGradient(700, 500, 0, 700, 500, 800);
    backgroundGradient.addColorStop(0, '#ffffff');
    backgroundGradient.addColorStop(0.3, '#f8fafc');
    backgroundGradient.addColorStop(0.7, '#e2e8f0');
    backgroundGradient.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, 1400, 1000);

    // Add subtle texture pattern
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 1400; i += 40) {
      for (let j = 0; j < 1000; j += 40) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(i, j, 1, 1);
      }
    }
    ctx.globalAlpha = 1;

    // Main decorative border with gradient
    const borderGradient = ctx.createLinearGradient(0, 0, 1400, 1000);
    borderGradient.addColorStop(0, '#3b82f6');
    borderGradient.addColorStop(0.5, '#1d4ed8');
    borderGradient.addColorStop(1, '#1e40af');
    
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1340, 940);

    // Inner decorative border
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 1300, 900);

    // Additional elegant inner border
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2;
    ctx.strokeRect(70, 70, 1260, 860);

    // Top decorative elements
    ctx.fillStyle = borderGradient;
    ctx.beginPath();
    ctx.arc(150, 150, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1250, 150, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(150, 850, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1250, 850, 30, 0, Math.PI * 2);
    ctx.fill();    // Certificate header with shadow effect
    ctx.textAlign = 'center';
    
    // Shadow for title
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = 'bold 72px serif';
    ctx.fillText('CERTIFICATE', 703, 183);
    ctx.font = 'bold 42px serif';
    ctx.fillText('OF COMPLETION', 703, 233);
    
    // Main title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 72px serif';
    ctx.fillText('CERTIFICATE', 700, 180);
    ctx.font = 'bold 42px serif';
    ctx.fillText('OF COMPLETION', 700, 230);

    console.log('Certificate title rendered');

    // Elegant decorative line with ornaments
    const lineGradient = ctx.createLinearGradient(250, 280, 1150, 280);
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.1, '#3b82f6');
    lineGradient.addColorStop(0.5, '#1d4ed8');
    lineGradient.addColorStop(0.9, '#3b82f6');
    lineGradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(250, 280);
    ctx.lineTo(1150, 280);
    ctx.stroke();

    // Decorative diamonds
    ctx.fillStyle = '#3b82f6';
    ctx.save();
    ctx.translate(700, 280);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-8, -8, 16, 16);
    ctx.restore();    // "This is to certify that" text
    ctx.fillStyle = '#4b5563';
    ctx.font = '38px serif';
    ctx.fillText('This is to certify that', 700, 360);

    console.log('Certify text rendered');

    // User name with elegant styling and shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = 'bold 58px serif';
    ctx.fillText(userName, 703, 443);
    
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 58px serif';
    ctx.fillText(userName, 700, 440);

    console.log('User name rendered:', userName);

    // Underline for name
    const nameWidth = ctx.measureText(userName).width;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(700 - nameWidth/2 - 20, 470);
    ctx.lineTo(700 + nameWidth/2 + 20, 470);
    ctx.stroke();    // Course completion text
    ctx.fillStyle = '#4b5563';
    ctx.font = '38px serif';
    ctx.fillText('has successfully completed the course', 700, 540);

    // Course name with improved sizing and alignment
    ctx.textAlign = 'center';
    
    // Function to wrap text if it's too long
    function wrapText(context, text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }    // Determine appropriate font size based on course name length
    let fontSize = 46;
    let maxWidth = 1000; // Maximum width for course name
    
    ctx.font = `bold ${fontSize}px serif`;
    let courseNameWidth = ctx.measureText(courseName).width;
    
    // Adjust font size if text is too wide
    while (courseNameWidth > maxWidth && fontSize > 28) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px serif`;
      courseNameWidth = ctx.measureText(courseName).width;
    }
    
    // If still too wide, wrap the text
    const courseLines = wrapText(ctx, courseName, maxWidth);
    const lineHeight = fontSize + 10;
    const totalHeight = courseLines.length * lineHeight;
    const startY = 600 - (totalHeight / 2) + (lineHeight / 2);
    
    // Background for course name (adjusted for multiple lines)
    const backgroundWidth = Math.max(...courseLines.map(line => ctx.measureText(line).width)) + 60;
    const backgroundHeight = totalHeight + 20;
    
    const courseGradient = ctx.createLinearGradient(
      700 - backgroundWidth/2, startY - 20,
      700 + backgroundWidth/2, startY + backgroundHeight - 20
    );
    courseGradient.addColorStop(0, 'rgba(5, 150, 105, 0.1)');
    courseGradient.addColorStop(0.5, 'rgba(5, 150, 105, 0.2)');
    courseGradient.addColorStop(1, 'rgba(5, 150, 105, 0.1)');
    
    ctx.fillStyle = courseGradient;
    ctx.fillRect(700 - backgroundWidth/2, startY - 20, backgroundWidth, backgroundHeight);
    
    // Draw course name lines with shadow
    courseLines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillText(line, 703, y + 3);
        // Main text
      ctx.fillStyle = '#059669';
      ctx.fillText(line, 700, y);
    });

    console.log('Course name rendered:', courseName);

    // Completion date with proper spacing
    const dateY = startY + totalHeight + 60;
    ctx.fillStyle = '#6b7280';
    ctx.font = '32px serif';
    ctx.fillText(`Completed on ${completionDate}`, 700, dateY);

    console.log('Completion date rendered:', completionDate);

    // Signature section with enhanced styling
    const signatureY = Math.max(dateY + 80, 800); // Ensure minimum distance from bottom
    
    ctx.textAlign = 'left';
      // Left signature area
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 28px serif';
    ctx.fillText('Skill Sprint', 180, signatureY);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '22px serif';
    ctx.fillText('Authorized', 180, signatureY + 30);
    
    // Signature line with gradient
    const sigGradient = ctx.createLinearGradient(180, signatureY + 50, 450, signatureY + 50);
    sigGradient.addColorStop(0, '#3b82f6');
    sigGradient.addColorStop(1, 'transparent');
    ctx.strokeStyle = sigGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, signatureY + 50);
    ctx.lineTo(450, signatureY + 50);
    ctx.stroke();

    // Certificate ID and date section
    ctx.textAlign = 'right';
    const certificateId = `CERT-${Date.now().toString(36).toUpperCase()}`;
      ctx.fillStyle = '#374151';
    ctx.font = 'bold 24px serif';
    ctx.fillText('Certificate ID:', 1220, signatureY - 10);
    
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(certificateId, 1220, signatureY + 20);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px serif';
    ctx.fillText(`Generated: ${new Date().toLocaleDateString()}`, 1220, signatureY + 50);

    // Add seal/badge (positioned relative to signature area)
    const sealX = 1100;
    const sealY = signatureY - 70;
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 60, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(sealX, sealY, 45, 0, Math.PI * 2);
    ctx.stroke();
      ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED', sealX, sealY - 10);
    ctx.fillText('COMPLETION', sealX, sealY + 10);

    console.log('Certificate generation completed successfully');

    // Convert canvas to buffer with high quality
    const buffer = canvas.toBuffer('image/png', { 
      compressionLevel: 6, 
      filters: canvas.PNG_FILTER_NONE 
    });

    // Upload to Cloudinary in the specified folder
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: `ai-learning-certificate/cert_${userName.replace(/\s+/g, '_')}_${Date.now()}`,
          format: 'png',
          quality: 'auto:best',
          fetch_format: 'auto',
          flags: 'progressive',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return {
      url: uploadResult.secure_url,
      certificateId,
      publicId: uploadResult.public_id,
      width: 1400,
      height: 1000,
    };
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw new Error('Failed to generate certificate');
  }
}