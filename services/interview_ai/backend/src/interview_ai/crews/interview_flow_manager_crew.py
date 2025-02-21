from crewai import Agent, Crew, Task
from crewai.project import CrewBase, agent, crew, task

###############################################################################
# Crew 4: State Determiner Crew
#   - Contains an agent that determines the interview's current state.
#   - Input: conversation_history and skills dict.
#   - Output: one of "welcome", "interview", or "completion".
###############################################################################
@CrewBase
class InterviewFlowManagerCrew:
    """State Determiner Crew: Determines the current state of the interview flow."""

    agents_config = 'config/flow_agents.yaml' 
    tasks_config = 'config/flow_tasks.yaml' 

    @agent
    def flow_manager(self) -> Agent:
        """Flow Manager agent config to decide the interview stage."""
        return Agent(
            config=self.agents_config['flow_manager'],
            # verbose=True
        )

    @task
    def flow_manager_task(self) -> Task:
        """Task for determining the current state of the interview."""
        return Task(
            config=self.tasks_config['flow_management_task'],
            # verbose=True
        )

    @crew
    def crew(self) -> Crew:
        """
        Defines the State Determiner Crew and the process for determining the current state
        of the interview based on conversation history and skills.
        """
        return Crew(
            agents=[self.flow_manager()],
            tasks=[self.flow_manager_task()],
            # verbose=True,
            output_log_file='logs/flow_manager_crew.log'
        )
