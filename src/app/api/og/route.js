import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'SkillSprint - AI-Powered Learning Platform';
  const description = searchParams.get('description') || 'Create personalized learning courses instantly with AI';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Logo and Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.5 2A7.5 7.5 0 0 0 4 10c0 4.5 3.5 8 7.5 8s7.5-3.5 7.5-8c0-4.142-3.358-7.5-7.5-7.5c0 0 3.5 2.5 3.5 7.5 0 2.5-1.5 5-3.5 5s-3.5-2.5-3.5-5c0-5 3.5-7.5 3.5-7.5Z"
                fill="white"
              />
            </svg>
          </div>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            SkillSprint
          </h1>
        </div>

        {/* Main Content */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '800px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h2
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: '0 0 20px 0',
              lineHeight: '1.2',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: '24px',
              color: '#64748b',
              margin: '0 0 30px 0',
              lineHeight: '1.4',
            }}
          >
            {description}
          </p>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              marginTop: '30px',
            }}
          >
            {['AI-Powered', 'Personalized', 'Certificates'].map((feature) => (
              <div
                key={feature}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '20px',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: '40px',
            color: 'white',
            fontSize: '20px',
            fontWeight: '500',
          }}
        >
          Join 50,000+ learners worldwide
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
