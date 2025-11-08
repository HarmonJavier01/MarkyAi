# TODO: Update Image Generation to Use Google AI Studio API

- [x] Update supabase/functions/generate-image/index.ts to use Google AI Studio Imagen API
- [x] Remove Pollination API requirement
- [x] Update MainApp.tsx to use Supabase function instead of direct API calls (fixes CORS)
- [x] Test the updated function to ensure it works without 402 error

# TODO: Update Supabase Project Configuration

- [x] Update supabase/config.toml to use new project ID
- [x] Create .env file with new Supabase credentials
- [x] Restart development server
- [x] Deploy the updated Supabase function to the new project
- [x] Test the app with the new Supabase project
