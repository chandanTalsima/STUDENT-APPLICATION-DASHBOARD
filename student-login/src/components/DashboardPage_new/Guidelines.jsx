import React, { useState } from "react";

const Guidelines = () => {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: "Choose Program & Intake",
      icon: "🎯",
      description: "Select your desired program and intake term",
      items: ["Select Program Type, Field of Study, Intake Term", "Click Continue"]
    },
    {
      id: 2,
      title: "Personal Information",
      icon: "👤",
      description: "Provide your personal details",
      items: ["Enter DOB, Gender, Nationality", "ID Proof Number, Address, Emergency Contact"]
    },
    {
      id: 3,
      title: "Academic History",
      icon: "🎓",
      description: "Add your educational background",
      items: ["List prior institutions, degrees, graduation year", "Upload transcripts (PDF)"]
    },
    {
      id: 4,
      title: "Test Scores",
      icon: "📊",
      description: "Submit standardized test results",
      items: ["Enter test scores (SAT, GRE, etc.)", "Upload score reports"],
      optional: true
    },
    {
      id: 5,
      title: "Statement of Purpose",
      icon: "📝",
      description: "Share your motivation and goals",
      items: ["Upload or paste a 500-word SOP outlining goals and reason for choosing Kaplan"]
    },
    {
      id: 6,
      title: "Letters of Recommendation",
      icon: "📋",
      description: "Get recommendations from mentors",
      items: ["Enter recommender info", "Upload letters or send requests"]
    },
    {
      id: 7,
      title: "Application Fee",
      icon: "💳",
      description: "Complete payment process",
      items: ["Pay fee online and receive confirmation"]
    },
    {
      id: 8,
      title: "Review & Submit",
      icon: "✅",
      description: "Final review before submission",
      items: ["Review entered info", "Accept declaration", "Click Submit"]
    }
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxHeight: '600px',
      overflowY: 'auto',
      padding: '8px'
    }}>
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} style={{ position: 'relative' }}>
            {/* Connecting Line */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                left: '19px',
                top: '50px',
                width: '2px',
                height: '60px',
                background: 'linear-gradient(to bottom, #e5e7eb, #f3f4f6)',
                zIndex: 0
              }}></div>
            )}

            {/* Step Card */}
            <div
              onClick={() => setActiveStep(isActive ? null : step.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : '#ffffff',
                border: `1px solid ${isActive ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                zIndex: 1,
                boxShadow: isActive 
                  ? '0 4px 12px rgba(59, 130, 246, 0.15)' 
                  : '0 1px 3px rgba(0, 0, 0, 0.05)',
                transform: isActive ? 'translateX(4px)' : 'translateX(0)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                {/* Step Number & Icon */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '40px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isActive 
                      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                      : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 8px rgba(59, 130, 246, 0.3)' : 'none'
                  }}>
                    {isActive ? '✓' : step.icon}
                  </div>
                  {step.optional && (
                    <span style={{
                      fontSize: '10px',
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}>
                      Optional
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: isActive ? '#1d4ed8' : '#111827'
                    }}>
                      {step.title}
                    </h4>
                    <svg
                      style={{
                        width: '16px',
                        height: '16px',
                        color: '#6b7280',
                        transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {step.description}
                  </p>

                  {/* Expandable Content */}
                  <div style={{
                    maxHeight: isActive ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ paddingTop: '8px' }}>
                      {step.items.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '6px',
                          fontSize: '13px',
                          color: '#374151'
                        }}>
                          <div style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                            marginTop: '6px',
                            flexShrink: 0
                          }}></div>
                          <span dangerouslySetInnerHTML={{
                            __html: item.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1d4ed8;">$1</strong>')
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Final completion message */}
      <div style={{
        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        border: '1px solid #a7f3d0',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        marginTop: '8px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#065f46',
          fontWeight: '600'
        }}>
          <span style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px'
          }}>
            ✓
          </span>
          Complete all steps for successful application
        </div>
      </div>
    </div>
  );
};

export default Guidelines;