[![GRCRT RiP](https://imageshack.com/a/img924/1207/i7h0Kp.png)](https://grcrt.net)

<h2 align="center"><a href="https://grcrt.net">TIME TO SAY GOODBYE</a></h2>
  
GRCRT was created and developed with passion. By gamers, for gamers, and over the 13 years of its existence, it has gathered around itself quite a large community of regular users: currently about 10,000 per month (and at its peak even 21,000) from 126 countries around the world.

Unfortunately, the hard truth is that passion alone is not enough. When we gave up displaying ads a few years ago, we switched to a donation model. GRCRT has therefore relied solely on your generosity and goodwill. It was your contributions that kept the servers running, enabling us to provide the tools that many of you can't imagine playing without. Recently, however, the reality of financial constraints has become impossible to ignore. Year after year, the amount of donations decreased, often not sufficing, forcing us to contribute from our own pockets. This year, that aid has dropped dramatically, covering about 55% of the necessary €2040 needed to maintain our infrastructure. Unfortunately, we can no longer afford to bear such high costs, so we are sad to announce that at the end of this year, the GRCRT project is going to be closed in its entirety. Definitely.

What does this closure mean in practice? GRCRT is not only a script: it's also statistics, activity monitor, image version of the report (for sharing where the standard report doesn't work) and graphic elements on converted reports. And since players come from all corners of the world, GRCRT should be equally (quickly) accessible to each of them, regardless of location (we even have players from Antarctica). In order to be able to ensure proper operation of these functionalities, a proper infrastructure is needed:

* to read / write the data fast we use a powerful dedicated server with SSD drives
* to secure your reports and statistics in case of a failure we have a second server with backups
* a service called CDN is responsible for fast access to data from anywhere in the world

This is an extremely difficult decision and having to say goodbye - after so many years - to a project that for many of us has become an indispensable and integral part of the game is hard to accept.
To each and every one of you who has been a part of this multi-year journey, we would like to express our deepest gratitude and appreciation. Your support, whether through financial contributions, bug reports, or simply playing or talking together, has made an immeasurable difference.

In particular, however, we would like to thank the group of 17 most dedicated users who have supported us on a regular, monthly (and some more often) basis. Forgive us if, due to GDPR, we do not disclose your names. 

Thank you for being with us all these years.

Thank you for supporting us.

We are sorry that we have to part ways.

Farewell....

Potusek,
anpu

p.s. If anyone would like to take over and continue GRCRT and is interested in buying back the site, domain and services, feel free to contact us: potusek@grcrt.net

---

[![GRCRT Logo](https://imageshack.com/a/img924/4606/RzPCrp.png)](https://grcrt.net)

<h2 align="center"><a href="https://grcrt.net">GRCRT</a></h2>

<p align="center">
  <em>What started in 2011 as a small and simple hobby project, known as Grepolis Report Converter (GRC), </br>
  kept growing over time to become GRCRT: Grepolis Report Converter Revolution Tools</em>
</p>


[![GitHub version](https://img.shields.io/github/release/grcrt/grcrt-script.svg?label=version&colorB=ff69b4)](https://github.com/grcrt/grcrt-script/releases/latest)
[![CircleCI](https://img.shields.io/circleci/project/github/grcrt/grcrt-script.svg)](https://circleci.com/gh/grcrt/grcrt-script/tree/master)
[![GitHub issues](https://img.shields.io/github/issues-raw/grcrt/grcrt-script.svg)](https://github.com/grcrt/grcrt-script/issues?q=is%3Aopen)
[![GitHub contributors](https://img.shields.io/github/contributors/grcrt/grcrt-script.svg)](https://github.com/grcrt/grcrt-script/graphs/contributors)
[![license](https://img.shields.io/github/license/grcrt/grcrt-script.svg)](https://github.com/grcrt/grcrt-script/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

---
# Table of contents
- [Table of contents](#table-of-contents)
- [Script functions](#script-functions)
  - [BBCode Converter](#bbcode-converter)
    - [What is it converting?](#what-is-it-converting)
    - [Where can the converted information be inserted?](#where-can-the-converted-information-be-inserted)
    - [What if BBcode is not suppoprted?](#what-if-bbcode-is-not-suppoprted)
  - [Army Builder Helper](#army-builder-helper)
  - [Radar](#radar)
  - [City Wall](#city-wall)
  - [Academy Overview](#academy-overview)
  - [Other functions](#other-functions)
- [Installing](#installing)
- [Authors](#authors)
- [Contributors](#contributors)
- [License](#license)


# Script functions
GRCRT is offering a plethora of functions. Below are described the ones most commonly used.

## BBCode Converter
Core function of the script. BBCode conversion makes sharing information just a few mouse clicks away.

### What is it converting?
  - most of the reports (battle reports with revolt being stirred up, will show an additional strategic information about the upstirred city)
  - list of cities on an island
  - list of players in an alliance
  - troops movements
  - individual orders (in case of an incoming attack, also with units shown by "Wisdom" spell)
  - many more...

### Where can the converted information be inserted?
  - in-game messages
  - in-game notes
  - in-game forums
  - external forums

### What if BBcode is not suppoprted?
With GRCRT there is always a way to share a report :relaxed:. For places where BBCodes are not supported, script offers 2 alternative solutions:
  - convert to image
  - URL to an online copy of the report

![Report Converter with Revolt](https://cdn.grcrt.net/fo/converter.png)

**[⬆ back to top](#table-of-contents)**

## Army Builder Helper
Makes queueing troops easier by optimising transfers of resources. Type of unit and desired amount can be set separatley for each city.

![Army Builder Helper](https://cdn.grcrt.net/fo/abh.png)

**[⬆ back to top](#table-of-contents)**

## Radar
Also known as "town search", can find following (in a desired radius):
  - own cities
  - specific player's cities
  - specific alliance's cities
  - inactive player's cities
  - ghost towns (abandoned cities)
  - any city

![Radar (Town search)](https://cdn.grcrt.net/fo/radar.png)

**[⬆ back to top](#table-of-contents)**

## City Wall
Source of information on lost/defeated units. 

Also offering following functions:
  - storing the wall for the current moment (maximum 10 records)
  - comparison between saved records
  - conversion of displayed information
    - lost as an attacker
    - defeated as an attacker
    - lost as a defender
    - defeated as a defender
    - total of units lost/defeated
    - difference in units lost/defeated (since last or any chosen, saved, wall record)
    - no amounts, just icons
    - any combination of the above

![Wall converter](https://cdn.grcrt.net/fo/wall.png)

**[⬆ back to top](#table-of-contents)**

## Academy Overview
Quick and easy glance on all of the Academies in all of the cities, with the possibility of starting/canceling researches.

![Academy Overview](https://cdn.grcrt.net/fo/ao.png)

**[⬆ back to top](#table-of-contents)**

## Other functions
In addition to the above, script also provides:
  - inserting smileys in messages, notes and in-game forums (with the possibility of adding own emoticons)
  - audible signaling of an incoming attack (the source of which may also be a YouTube)
  - list of own cities, sorted by distance in relation to a given city
  - direct access to player/alliance/city statistics (displayed in an in-game window)
  - information on potentially inactive players (no points of attack and/or expansion)
  - recipes for game Events (Easter, Halloween etc)

**[⬆ back to top](#table-of-contents)**

# Installing
We've prepared instructional videos for some of the most popular web browsers.
  - [Google Chrome](https://www.youtube.com/watch?v=tc-5lj8L8xI)
  - [Mozilla Firefox](https://www.youtube.com/watch?v=8hBdSGRiheI)
  - [Opera](https://www.youtube.com/watch?v=Dq4TNTQ7iRo)

# Authors
  - [Piotr Łakomy](https://github.com/Potusek) (Potusek)
  - [Tomasz Paluszkiewicz](https://github.com/tomaski) (anpu)

# Contributors
  - [Piotr Łakomy](https://github.com/Potusek) (Potusek)
  - [Tomasz Paluszkiewicz](https://github.com/tomaski) (anpu)

Do you want to see your name here? Have a read on our [contribution guidelines](https://github.com/grcrt/grcrt-script/blob/master/.github/CONTRIBUTING.md)

# License
GRCRT is released under the [GPL v3](https://github.com/grcrt/grcrt-script/blob/master/LICENSE) license.

**[⬆ back to top](#table-of-contents)**
