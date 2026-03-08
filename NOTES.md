# NOTES

## What I Built

- Moved `index.html` from the `public` folder to the project root to ensure Vite correctly serves the application.
- Added a priority field for tasks (`low`, `medium`, `high`) with a dropdown selector when creating a new task.
- Implemented task filtering, allowing users to filter by:
  - All tasks
  - Active tasks
  - Completed tasks
  - Priority level
- Created a central stylesheet (`App.css`) instead of inline styles to keep styling consistent and easier to maintain as the project grows.
- Improved the UI by adding:
  - consistent spacing and layout
  - button styling with subtle shadows
  - priority labels displayed as colored pill badges for better visual clarity

## Decisions

- Filtering was implemented using query parameters on the backend (`/api/tasks?priority=high&completed=true`) so the frontend can request only the tasks it needs
- Styling was intentionally kept lightweight and framework-free to keep the project simple and focused on functionality

## What I Would Improve With More Time

If I had more time, I would:

- Add small UI animations for task completion and deletion to improve user feedback.
- Add additional task fields such as:
  - description for more detailed task information
  - completion date to track when tasks are finished.
- Improve the UI further with:
  - hover states
  - better accessibility
  - keyboard interactions.
