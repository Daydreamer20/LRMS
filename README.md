---
title: LRE Invitation Form
emoji: 📝
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# Learning Resource Evaluator System
A web application for managing DepEd Learning Resource Evaluator registrations.

## Overview
This system allows Learning Resource Evaluators to:
- Register for evaluation assignments
- Select preferred evaluation areas
- Choose grade levels for evaluation
- Provide contact and professional information

## Features
- User registration for LREs including:
  - Full Name
  - Region and Division
  - Designation
  - Preferred Area of Evaluation (Area 1 or 3)
  - Preferred Grade Level (5 or 8)
  - Contact Information
  - DepEd Email Address

## Technical Details
- Built with React.js
- Styled with Tailwind CSS
- Containerized with Docker
- Deployed on Hugging Face Spaces

## Access
- Main Form: https://huggingface.co/spaces/Elly00/lre_invite
- Admin Dashboard: https://huggingface.co/spaces/Elly00/lre_invite/admin (Password: admin123)

## Development
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm run dev
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.