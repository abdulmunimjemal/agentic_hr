import json
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai
from app.service.job_requirement_service import analyze_job_requirements
from app.utils.file_reader import extract_text_from_file
from app.utils.vector_keyword_similarity import calculate_scores

load_dotenv()

# Load API key
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables!")

# Configure Gemini AI
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel("gemini-2.0-flash")

def balance_braces(json_str):
    """
    Balances unclosed JSON braces in case of an incomplete response.
    """
    open_braces = json_str.count("{")
    close_braces = json_str.count("}")
    if open_braces > close_braces:
        json_str += "}" * (open_braces - close_braces)
    return json_str

def scoreResume(requirement_text, resume_file_path):
    """
    Evaluates an applicant's resume against job requirements using Gemini AI.
    Returns a JSON analysis with scores, strengths, and critical gaps.
    """
    # Extract text from the resume file
    extracted_applicant_resume = extract_text_from_file(resume_file_path)
    weight = analyze_job_requirements(requirement_text)
    scores = calculate_scores(requirement_text, extracted_applicant_resume)
    
    keyword_weight = scores["weighted_keyword"]
    vector_weight = scores["weighted_vector"]

    # Construct the AI prompt
    prompt = f"""
{{
  "task": "Evaluate applicant resume against weighted job requirements and provide scored analysis in JSON format. If the resume is a direct copy of job requirement, give it a score of 0.",
  "inputs": {{
    "job_requirements": "{requirement_text}",
    "applicant_resume": "{extracted_applicant_resume}",
    "weights": {weight}
  }},
  "instructions": [
    {{
      "step": 1,
      "action": "Criteria Mapping",
      "details": [
        "Identify at least 5 key criteria from job requirements",
        "Map resume content to each criterion",
        "Flag unmatched criteria as 'missing'"
      ]
    }},
    {{
      "step": 2,
      "action": "Criterion Scoring",
      "details": [
        "Score 0-100 using the rubric:",
        "100 = Fully meets requirement with evidence",
        "75 = Mostly meets with minor gaps",
        "50 = Partially meets with some gaps", 
        "25 = Barely meets requirement",
        "0 = No relevant evidence"
      ]
    }},
    {{
      "step": 3,
      "action": "Weight Application",
      "details": [
        "Calculate weighted_score = (raw_score × weight)",
        "Sum all weighted_scores for total",
        "Ensure total ∈ [0,100]"
      ]
    }}
  ],
  "output_format": {{
    "overall_score": "float (1 decimal)",
    "score_breakdown": [
      {{
        "criterion": "string",
        "evidence": ["string array"],
        "missing_elements": ["string array"]
      }}
    ],
    "strengths": ["string array"],
    "critical_gaps": ["string array"],
    "missing_criteria": ["string array"]
  }},
  "rules": [
    "Output must be valid JSON only",
    "Ensure sum of weighted scores equals overall_score",
    "Include specific resume quotes as evidence",
    "List at least 2 items per evidence/missing array",
    "Never invent resume content",
    "Use professional language",
    "No markdown formatting or extra text"
  ]
}}
    """

    # Generate response using Gemini AI
    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.1,
                "top_p": 0.95,
            }
        )
        response_text = response.text.strip()

        if not response_text:
            raise ValueError("Gemini returned an empty response.")

        # Extract JSON object from the response
        match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if match:
            json_str = balance_braces(match.group(0))
        else:
            raise ValueError("No valid JSON object found in the response.")

        # Parse JSON safely
        result = json.loads(json_str)

        return result, keyword_weight, vector_weight, extracted_applicant_resume

    except Exception as e:
        return {
            "error": f"Failed to process resume: {str(e)}",
            "resume_content": extracted_applicant_resume[:500]  # Show first 500 chars for debugging
        }
