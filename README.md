# T-Tall Barbershop Website

## Student Information
- **Student Name:** Molatelo Setsiba
- **Student Number:** ST10521163
- **Module/Course:** Website development
- **Institution:** Rosebank International (WEDE5020)

## Project Title
**T-Tall Barbershop Website**

## Project Overview
This project is a multi-page website for **T-Tall Barbershop**. It provides visitors with information about the barbershop, the services offered, contact/enquiry options, and a structured navigation flow across key pages.

The website is built using **HTML** and **CSS**, with images/media stored in the **Assets** folder.

## Website Goals and Objectives
1. Present the brand identity of T-Tall Barbershop.
2. Provide clear information about services and the services process.
3. Enable visitors to make enquiries and contact the business.
4. Improve user experience using simple navigation and consistent styling.
5. Ensure the website content is organized with a clear sitemap and page structure.

## Key Features
- **Home page (index.html)**: Introduction and primary navigation.
- **Services page (services.html)**: Overview of services and offerings.
- **About page (about.html)**: Company/brand background.
- **Enquiry page (Enquiry.html)**: Enquiry form/information (as designed in the page).
- **Contact page (contact.html)**: Contact details and/or contact section.
- **Responsive-friendly layout** (based on existing CSS styling in `style_original.css`).
- Media and imagery via the **Assets** folder.

## AJAX Form Submission (Improved UX)
Form submission on the following pages is handled asynchronously using **AJAX (fetch API)**:
- `contact.html` → POSTs to `action="/contact"`
- `Enquiry.html` → POSTs to `action="enquiry/index.html"`

User experience enhancements include:
- Immediate UI feedback (e.g., *Sending...* / *Success* messages)
- Submit button disabled during the async request to prevent double submissions
- No full page reload/navigation on submit

> Note: The AJAX calls still rely on the existence of the backend routes configured by the `action` attributes.

## Sitemap
- **Home:** `index.html`
- **Services:** `services.html`
- **About:** `about.html`
- **Enquiry:** `Enquiry.html`
- **Contact:** `contact.html`

## Changelog
  - Initial multi-page structure added/updated:
    - `index.html`, `services.html`, `about.html`, `Enquiry.html`, `contact.html`
  - Shared styling applied via `style_original.css`
  - Assets organized under `Assets/`
- **v1.1:**
  - Improved contact/enquiry submission UX using AJAX (`fetch()`)

## Repository
- GitHub: https://github.com/pandaM-cloud/t-tall.git

## Pictures of my GUI
<img width="746" height="751" alt="bean" src="https://github.com/user-attachments/assets/68debc1a-edab-40fa-a78e-29f5d8c2351e" />
<img width="1221" height="1288" alt="TUMI" src="https://github.com/user-attachments/assets/cf4dd772-ec2f-4d15-887c-2627c0066515" />
<img width="960" height="1280" alt="burgersfort" src="https://github.com/user-attachments/assets/51a18b10-8169-45cc-b328-2d26dbd32a00" />
<img width="1200" height="1600" alt="me" src="https://github.com/user-attachments/assets/5b264a83-120e-48fd-8409-106c50450614" />
<img width="1536" height="2048" alt="sj" src="https://github.com/user-attachments/assets/5d38a6d4-759d-4ba8-ab38-df84643602d7" />
<img width="959" height="1280" alt="black" src="https://github.com/user-attachments/assets/de3c575d-0296-4071-9c94-7fa54dbb84f5" />

