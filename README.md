# Novaris Mobility

Site vitrine de **Novaris Mobility** — la mobilité électrique intelligente et durable (Power Company SARL).

## ✨ Fonctionnalités

- **Landing page moderne** (FR) : solutions, avantages, réseau de recharge, contact.
- **Section Agents IA** : assistants conversationnels, optimisation autonome, maintenance prédictive.
- **Chatbot IA flottant** : assistant disponible en bas à droite, réponses automatiques (recharge, tarifs, flottes, contact). Le moteur de réponses est branchable sur une vraie API IA.
- **Expérience cinématique 3D** (Three.js) : au chargement, une supercar style Bugatti dans un showroom. En faisant défiler, la caméra tourne autour, s'approche, puis **entre dans l'habitacle** (volant + tableau de bord illuminés), avec néons, reflets, particules et effet *bloom*.

## 🚀 Lancer le site

C'est un site **statique** — aucune compilation nécessaire.

```bash
# Option 1 : ouvrir directement
open index.html

# Option 2 : serveur local (recommandé pour les modules ES / Three.js)
python3 -m http.server 8000
# puis http://localhost:8000
```

> ℹ️ La scène 3D charge Three.js depuis un CDN (`unpkg`). Une connexion internet est requise au premier chargement.

## 📁 Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page complète (HTML + CSS + chatbot) |
| `bugatti.js` | Moteur 3D cinématique (Three.js, scroll-driven) |

## 🎨 Personnalisation

- Couleurs : variables CSS `--accent`, `--accent-2` en haut de `index.html`.
- Couleur de la voiture : matériau `blue` dans `buildCar()` (`bugatti.js`).
- Réponses du chatbot : fonction `answer()` dans `index.html`.
- Contact : `powercompanysarl@gmail.com`.
