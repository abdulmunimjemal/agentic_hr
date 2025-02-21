from interview_ai.crews.evaluator_crew import EvaluatorCrew
from interview_ai.crews.interview_qa_crew import InterviewQACrew
from interview_ai.crews.interview_flow_manager_crew import InterviewFlowManagerCrew
from interview_ai.crews.introduction_crew import IntroductionCrew
import json

flow_crew = InterviewFlowManagerCrew().crew()
intro_crew = IntroductionCrew().crew()
qa_crew = InterviewQACrew().crew()
eval_crew = EvaluatorCrew().crew()

def test(input, crew):
    try:
        result = crew.kickoff(inputs=input)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
    return result

# Test Flow Manager

flow_manager_inputs = [
    ({
        "conversation_history": [],
        "skills": {
            "Python": {
                "required_level": "advanced",
                "rating": 0,
                "questions_asked": 0,
                "weight": 9
            },
            "Testing": {
                "required_level": "advanced",
                "rating": 0,
                "questions_asked": 0,
                "weight": 3
            },
            
        },

    }, {"state": "welcome"}),
    ({
        "conversation_history": [
            {
                "question": "What is Python?",
                "answer": "Python is a programming language."
            }
        ],
        "skills": {
            "Python": {
                "required_level": "advanced",
                "rating": 0,
                "questions_asked": 0,
                "weight": 9
            },
            "Testing": {
                "required_level": "advanced",
                "rating": 0,
                "questions_asked": 0,
                "weight": 3
            },
            
        },

    }, {"state": "ongoing"}),
    ({
        "conversation_history": [
            {
                "question": "What is Python?",
                "answer": "Python is a programming language.",
                "question": "What is testing?",
                "answer": "Testing is the process of evaluating a system or its component(s) with the intent to find whether it satisfies the specified requirements or not."
            }
        ],
        "skills": {
            "Python": {
                "required_level": "advanced",
                "rating": 6,
                "questions_asked": 3,
                "weight": 9
            },
            "Testing": {
                "required_level": "advanced",
                "rating": 7,
                "questions_asked": 3,
                "weight": 3
            },
            
        },

    }, {"state": "completed"}),
    ({
        "conversation_history": [
            {
                "question": "What is Python?",
                "answer": "Python is a programming language.",
                "question": "What is testing?",
                "answer": "Testing is the process of evaluating a system or its component(s) with the intent to find whether it satisfies the specified requirements or not."
            }
        ],
        "skills": {
            "Python": {
                "required_level": "advanced",
                "rating": 6,
                "questions_asked": 3,
                "weight": 9
            },
            "Testing": {
                "required_level": "advanced",
                "rating": 7,
                "questions_asked": 2,
                "weight": 3
            },
            
        },

    }, {"state": "ongoing"}),
]

def test_flow_manager():
    for input, output in flow_manager_inputs:
        try:
            assert json.loads(test(input, flow_crew).raw) == output
        except Exception as e:
            print(f"Test failed: {e}")
            continue
    print("All tests passed for Flow Manager.")

# test_flow_manager()

    
# Test Introduction Crew
intro_crew_inputs = [
    {
        "user_info": """
            Name: John Doe
            Email:
            He is from Africa.
                """,
        "role_info": """
            Role: Software Engineer
            Experience: 5 years
            Company: Kifya Financial Technologies
            About Company: Kifya Financial Technologies is a financial technology company that provides financial services to individuals and businesses.
            """,
    },
    {
        "user_info": """
            Email: abdulmunim.jemal@gmail.com
            """,
        "role_info": """
            Role: Software Engineer
            Experience: 5 years
            Company: Kifya Financial Technologies
            """,
            }
]

def test_intro_crew():
    for input in intro_crew_inputs:
        try:
            assert json.loads(test(input, intro_crew).raw)['state'] == "welcome"
            print("-" * 50)
        except Exception as e:
            print(f"Test failed: {e}")
            continue
    print("All tests passed for Introduction Crew.")

# test_intro_crew()


def qa_loop():
    inputs= {
            "conversation_history": [
                {"question": "What is Python?"},
                {"answer": "Python is a programming language."},
                {"question": "What is testing?"}
            ],
            "skills": {
                "Python": {
                    "required_level": "advanced",
                    "rating": 2,
                    "questions_asked": 1,
                    "weight": 9
                },
                "Testing": {
                    "required_level": "advanced",
                    "rating": 0,
                    "questions_asked": 1,
                    "weight": 3
                }
            },
            "user_answer": "Testing is the process of evaluating a system or its component(s) with the intent to find whether it satisfies the specified requirements or not.",
            "user_info": """
        Education:
        - B.Sc. in Computer Science, XYZ University (2018 - 2022)

        Experience:
        - Software Engineer at ABC Tech (Jan 2023 - Present)
        * Developing scalable backend APIs using Python and FastAPI
        * Implementing CI/CD pipelines for automated deployment
        * Optimizing database queries for performance improvements
        - Software Engineer Intern at XYZ Solutions (June 2021 - Dec 2021)
        * Assisted in the development of a microservices architecture
        * Wrote unit tests to improve software reliability
        * Collaborated with frontend developers for API integration

        Projects:
        - AI-Powered Chatbot
        * Developed a chatbot using NLP techniques to provide customer support
        * Technologies: Python, TensorFlow, Flask
        - E-commerce Platform
        * Built a full-stack e-commerce web application with user authentication and payment processing
        * Technologies: React, Node.js, MongoDB
            """,
        "role_info": """
            Role: Software Engineer
            """

        }

    user_answer = ""

    while user_answer != "quit":
        interviewer = test(inputs, qa_crew).raw
        try:
            interviewer = json.loads(interviewer)
            assert interviewer['state'] == "ongoing"
            q = interviewer['text']
            inputs['conversation_history'].append({"question": q})
            inputs['skills'] = interviewer['skills']
            print("Interviewer: ", q)
        except Exception as e:
            print(f"An error occurred: {e}")
            input("Error occured: Press Enter to exit.")
            break

        
        user_answer = input("You: ")
        inputs['user_answer'] = user_answer

# qa_loop()

def test_evaluator_crew():
    inputs = {
        "conversation_history": [
            {
                "question": "What is Python?",
                "answer": "Python is a programming language."
            },
            {
                "question": "What is testing?",
                "answer": "Testing is the process of evaluating a system or its component(s) with the intent to find whether it satisfies the specified requirements or not."
            }
        ],
        "skills": {
            "Python": {
                "required_level": "advanced",
                "rating": 6,
                "questions_asked": 2,
                "weight": 9
            },
            "Testing": {
                "required_level": "advanced",
                "rating": 7,
                "questions_asked": 2,
                "weight": 3
            },
        },
        
        "role_info": """ 
            Role: Senior Python Engineer
            """,
        "user_info": """
              Education:
        - B.Sc. in Computer Science, XYZ University (2018 - 2022)

        Experience:
        - Software Engineer at ABC Tech (Jan 2023 - Present)
        * Developing scalable backend APIs using Python and FastAPI
        * Implementing CI/CD pipelines for automated deployment
        * Optimizing database queries for performance improvements
        - Software Engineer Intern at XYZ Solutions (June 2021 - Dec 2021)
        * Assisted in the development of a microservices architecture
        * Wrote unit tests to improve software reliability
        * Collaborated with frontend developers for API integration

        Projects:
        - AI-Powered Chatbot
        * Developed a chatbot using NLP techniques to provide customer support
        * Technologies: Python, TensorFlow, Flask
        - E-commerce Platform
        * Built a full-stack e-commerce web application with user authentication and payment processing
        * Technologies: React, Node.js, MongoDB
        """
    }

    try:
        result = test(inputs, eval_crew)
        assert json.loads(result.raw)['state'] == "completed"
    except Exception as e:
        print(f"Test failed: {e}")
    print("All tests passed for Evaluator Crew.")

test_evaluator_crew()