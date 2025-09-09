import React from "react";
import "./KaplanGuide.css";

const Guidelines = () => {
  return (
    <div className="kaplan-application-guide">

      <div className="kaplan-step">
        <h3>Step 1: Choose Program & Intake</h3>
        <ul>
          <li>Select Program Type, Field of Study, Intake Term</li>
          <li>Click <strong>Continue</strong></li>
        </ul>
      </div>

      <div className="kaplan-step">
        <h3>Step 2: Personal Information</h3>
        <ul>
          <li>Enter DOB, Gender, Nationality</li>
          <li>ID Proof Number, Address, Emergency Contact</li>
        </ul>
      </div>

      <div className="kaplan-step">
        <h3>Step 3: Academic History</h3>
        <ul>
          <li>List prior institutions, degrees, graduation year</li>
          <li>Upload transcripts (PDF)</li>
        </ul>
      </div>

      <div className="kaplan-step">
        <h3>Step 4: Test Scores (Optional)</h3>
        <ul>
          <li>Enter test scores (SAT, GRE, etc.)</li>
          <li>Upload score reports</li>
        </ul>
      </div>

      <div className="kaplan-step">
        <h3>Step 5: Statement of Purpose</h3>
        <p>Upload or paste a 500-word SOP outlining goals and reason for choosing Kaplan.</p>
      </div>

      <div className="kaplan-step">
        <h3>Step 6: Letters of Recommendation</h3>
        <ul>
          <li>Enter recommender info</li>
          <li>Upload letters or send requests</li>
        </ul>
      </div>

      <div className="kaplan-step">
        <h3>Step 7: Application Fee</h3>
        <p>Pay fee online and receive confirmation.</p>
      </div>

      <div className="kaplan-step">
        <h3>Step 8: Review & Submit</h3>
        <ul>
          <li>Review entered info</li>
          <li>Accept declaration</li>
          <li>Click <strong>Submit</strong></li>
        </ul>
      </div>

      <div className="kaplan-step">
        <h3>Step 9: Confirmation & Next Steps</h3>
        <p>Receive confirmation email and Application ID.</p>
      </div>

      <div className="kaplan-step">
        <h3>Optional: Upload Additional Documents</h3>
        <ul>
          <li>English proficiency certificate</li>
          <li>Financial or medical documentation</li>
        </ul>
      </div>
    </div>
  );
};

export default Guidelines;
