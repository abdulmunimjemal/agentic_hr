from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

###############################################################################
# Crew 2: Welcome Crew
#   - Contains one agent and task.
#   - Input: role info and user info.
#   - Provides a welcome message and explains the interview process.
###############################################################################
@CrewBase
class IntroductionCrew:
    """Welcome Crew: Greets the user and explains the interview process."""

    agents_config = 'config/intro_agents.yaml' 
    tasks_config = 'config/intro_tasks.yaml' 

    @agent
    def welcome_agent(self) -> Agent:
        """Welcome Agent config."""
        return Agent(
            config=self.agents_config['welcome_agent'],
            # verbose=True
        )

    @task
    def welcome_task(self) -> Task:
        """Task for generating a welcome message."""
        return Task(
            config=self.tasks_config['welcome_task'],
            # verbose=True
        )

    @crew
    def crew(self) -> Crew:
        """
        Defines the Welcome Crew and the process for welcoming the user
        and explaining the interview process.
        """
        return Crew(
            agents=[self.welcome_agent()],
            tasks=[self.welcome_task()],
            # verbose=True,
            output_log_file='logs/welcome_crew.log'
        )
