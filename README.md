# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# commands
npm i
npm run dev

npm run build
npm run deploy

npm run copy-and-deploy


# TODO


add volume slider
frontned only offer trade after dice and robber move
add german option
put is bools in sepetate funcs in backend
show ressourcen given -> animation?
change logging -> add history? add other messages: build, buy, move robber, steal...

other:
Add Option number when Card given robber -> 7
Add water and invisible tiles for boat expantion
add database
add autoplay after some seconds


DONE:

Fix Lobby Name,Style.. DONE
Show link to Copy after creating lobby DONE
look into initial dice throw bug? no diethrow gameowner? -> not reproducable? DONE
unused dev cards umgedreht sehen DONE
res verdecken DONE
hide bank res option DONE
option standart zahlen verteilung DONE
würfeln erst später DONE
ritter kann auch vor würfeln gespielt werden DONE
win nachricht DONE
dev card round limit DONE
nur eine dev card pro runde DONE
erklärungen dev card DONE
dev cards left bank DONE
sounds DONE
add dice counter DONE
info nachricht bevor dev karte gepielt wird DONE
better info on what player has to do/cant do DONE
fix board generation in frontend for different sizes DONE
add support for safari -> localstorage DONE
add more size configs backend DONE

on game list:
check gamestate and sorting stuff of games DONE
update avaliable games via socket DONE
