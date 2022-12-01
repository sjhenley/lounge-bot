# 2.0.0 (2022-12-02) - The Big Overhaul
The [first iteration](https://github.com/sjhenley/economy-bot) of my Discord bot was a side project for me to to provide a fun experience for myself and Discord friends while exapanding my coding proficiency. After almost a year of programming with node in a professional environment, I felt it was time to scrap the whole thing and use my new experience to design a more organized, extendible, and maintainable application. It's far from perfect, but I hope to continue using this application to explore more design and programming techniques and further push my coding skills.

## Economy
The economy feature from the original app has been ported over:
- Check your balance (or the balance of another member) with the `/balance` command
- Give funds from your balance to another member with the `/give` command
- The member with the highest balance is awarded a special Discord role

New updates for the 2.0 version:
- See the members with the highest balance using the `/top` command
- Directly add funds to a member with the the `/add-funds` command (Admins only)

## Activity Score
This update adds the first new(ish) to the existing application with the Activity Score feature! Members will be rewarded for being active in the Discord. Here's how it works:
1. Earn "activity points" by joining a voice call or sending messages in any channel
2. The app periodically checks the activity score of all members. If a member has acquired enough activity points, that member will have funds added to their economy balance.

## Nerdy Changes
- A complete re-write of the original application!
- Update Node to 18.12.1
- Update Discord.js to 14.6.0
- More diligent use of documentation and Typescript typing
- Organize source code into "modules"
- Refactor command and event management to be more resuable
- Leverage a configuration manager that dynamically loads configuration based on NODE_ENV
- Add Winston for logging

## Planned Features
I am constantly looking for new ideas to expand and improve the application. Please submit a request in the project [issues](https://github.com/sjhenley/lounge-bot/issues) page to ensure your idea is logged and tracked. In coming updates I hope to add:
- A system to periodically take balance from all members
- Ways to spend member balance (i.e. shop, gambling)
- A system to track member game activity and report a "Game of the Week"
