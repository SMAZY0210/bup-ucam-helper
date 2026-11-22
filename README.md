# BUP UCAM Helper

A Tampermonkey userscript for the BUP UCAM portal. It adds a mark calculator and grade predictor right on top of the normal portal pages, so you don't have to do the maths by hand.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Click this link: **[Install BUP UCAM Helper](https://raw.githubusercontent.com/SMAZY0210/bup-ucam-helper/main/bup-ucam-helper.user.js)**
3. Tampermonkey opens an install page. Click **Install**.
4. Open or refresh UCAM.

On Chrome or Edge, you may also need to turn on **Developer mode** in the extensions page (or "Allow user scripts" in Tampermonkey's extension details) before userscripts will run.

## What it adds

**Exam mark summary page**
- Total in-course mark. Theory uses the best 3 class tests scaled to 10, mid term scaled to 20, plus project/assignment and attendance (out of 50). Lab uses Quiz 20, Home Assignment 10, Class Performance 10, Viva 10 and Attendance 10 (out of 60).
- Input boxes for marks that aren't published yet, so you can try "what if" numbers and see the totals update live.
- A grade table showing what you need in the final for each grade, from A+ down to D.

**Attendance page**
- A "Score /10" column worked out from your present and absent counts.

**Faculty evaluation page**
- A small panel to fill every question with the same rating in one click.

## Updates

Tampermonkey checks this repo for new versions on its own. To force it, open the Tampermonkey dashboard and click "Check for userscript updates". New versions only get picked up when the `@version` number in the script goes up.

## Note

The marking schemes are based on the usual BUP rules. Your teacher's scheme might be different, so always check against the official result.
