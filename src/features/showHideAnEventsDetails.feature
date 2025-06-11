Feature: Show/Hide Event Details

    Scenario: An event element is collapsed by default
        Given the user hasn’t interacted with any event
        When the main page is loaded
        Then the event element should be collapsed by default

    Scenario: User can expand an event to see details
        Given the main page is loaded
        When the user clicks to see the event details
        Then the event element should expand to show the event details

    Scenario: User can collapse an event to hide details
        Given the event details are visible
        When the user clicks to hide the event details
        Then the event element should collapse and hide the event details

