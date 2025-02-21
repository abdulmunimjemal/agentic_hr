from crewai import Agent, Crew, Task
from crewai.project import CrewBase, agent, crew, task

###############################################################################
# Crew 3: Final Evaluator Crew
#   - Contains the Final Evaluator agent and task.
#   - Input: entire conversation_history and skills dict.
#   - Provides the final evaluation output.
###############################################################################
@CrewBase
class EvaluatorCrew:
    """Final Evaluator Crew: Provides the final evaluation at interview end."""
    agents_config = 'config/eval_agents.yaml' 
    tasks_config = 'config/eval_tasks.yaml' 

    @agent
    def final_evaluator(self) -> Agent:
        """Final Evaluator agent config."""
        return Agent(
            config=self.agents_config['final_evaluator'],
        )

    @task
    def final_evaluation_task(self) -> Task:
        """Task for the final evaluation."""
        return Task(
            config=self.tasks_config['final_evaluation_task'],
        )

    @crew
    def crew(self) -> Crew:
        """
        Defines the Final Evaluator Crew and the process for final evaluation at the end
        of the interview.
        """
        return Crew(
            agents=[self.final_evaluator()],
            tasks=[self.final_evaluation_task()],
            # verbose=True,
            output_log_file='logs/eval_crew.log'
        )
