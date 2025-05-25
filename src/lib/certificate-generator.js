import { createCanvas, loadImage } from 'canvas';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateCertificate(userName, courseName, completionDate) {
  try {
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
    ctx.fill();

    // Certificate header with shadow effect
    ctx.textAlign = 'center';
    
    // Shadow for title
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = 'bold 72px Georgia, serif';
    ctx.fillText('CERTIFICATE', 703, 183);
    ctx.font = 'bold 42px Georgia, serif';
    ctx.fillText('OF COMPLETION', 703, 233);
    
    // Main title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 72px Georgia, serif';
    ctx.fillText('CERTIFICATE', 700, 180);
    ctx.font = 'bold 42px Georgia, serif';
    ctx.fillText('OF COMPLETION', 700, 230);

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
    ctx.restore();

    // "This is to certify that" text
    ctx.fillStyle = '#4b5563';
    ctx.font = '38px Georgia, serif';
    ctx.fillText('This is to certify that', 700, 360);

    // User name with elegant styling and shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = 'bold 58px Brush Script MT, cursive';
    ctx.fillText(userName, 703, 443);
    
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 58px Brush Script MT, cursive';
    ctx.fillText(userName, 700, 440);

    // Underline for name
    const nameWidth = ctx.measureText(userName).width;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(700 - nameWidth/2 - 20, 470);
    ctx.lineTo(700 + nameWidth/2 + 20, 470);
    ctx.stroke();

    // Course completion text
    ctx.fillStyle = '#4b5563';
    ctx.font = '38px Georgia, serif';
    ctx.fillText('has successfully completed the course', 700, 540);

    // Course name with background highlight
    const courseNameWidth = ctx.measureText(courseName).width;
    
    // Background for course name
    const courseGradient = ctx.createLinearGradient(
      700 - courseNameWidth/2 - 30, 580,
      700 + courseNameWidth/2 + 30, 620
    );
    courseGradient.addColorStop(0, 'rgba(5, 150, 105, 0.1)');
    courseGradient.addColorStop(0.5, 'rgba(5, 150, 105, 0.2)');
    courseGradient.addColorStop(1, 'rgba(5, 150, 105, 0.1)');
    
    ctx.fillStyle = courseGradient;
    ctx.fillRect(700 - courseNameWidth/2 - 30, 580, courseNameWidth + 60, 40);
    
    // Course name shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = 'bold 46px Georgia, serif';
    ctx.fillText(courseName, 703, 603);
    
    // Course name
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 46px Georgia, serif';
    ctx.fillText(courseName, 700, 600);

    // Completion date with styling
    ctx.fillStyle = '#6b7280';
    ctx.font = '32px Georgia, serif';
    ctx.fillText(`Completed on ${completionDate}`, 700, 700);

    // Signature section with enhanced styling
    ctx.textAlign = 'left';
    
    // Left signature area
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText('AI Learning Platform', 180, 820);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '22px Georgia, serif';
    ctx.fillText('Authorized Signature', 180, 850);
    
    // Signature line with gradient
    const sigGradient = ctx.createLinearGradient(180, 870, 450, 870);
    sigGradient.addColorStop(0, '#3b82f6');
    sigGradient.addColorStop(1, 'transparent');
    ctx.strokeStyle = sigGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 870);
    ctx.lineTo(450, 870);
    ctx.stroke();

    // Certificate ID and date section
    ctx.textAlign = 'right';
    const certificateId = `CERT-${Date.now().toString(36).toUpperCase()}`;
    
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText('Certificate ID:', 1220, 810);
    
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(certificateId, 1220, 840);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Georgia, serif';
    ctx.fillText(`Generated: ${new Date().toLocaleDateString()}`, 1220, 870);

    // Add seal/badge
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    ctx.arc(1100, 750, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(1100, 750, 60, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(1100, 750, 45, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED', 1100, 745);
    ctx.fillText('COMPLETION', 1100, 765);

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