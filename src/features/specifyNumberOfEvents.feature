Feature: Specify Number of Events

    Scenario: When the user hasn’t specified a number, 32 is the default
        Given the main page is open
        When the user hasn’t changed the number of events
        Then 35 events should be displayed by default

    Scenario: User can change the number of events
        Given the main page is open
        When the user sets the number of events to 10
        Then the event list should show 10 events

