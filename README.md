# ADVF · Les besoins fondamentaux

Application statique complète : 30 situations, 24 analyses avec leur exemple, récit intégral de Madame A et 14 fiches de besoins. Une seule image, sur l’accueil.

## Mise en ligne gratuite

1. Créez un dépôt GitHub **public** et déposez le contenu de ce dossier à sa racine, y compris `.github/workflows/pages.yml`, sur la branche `main`.
2. Dans **Settings → Pages → Source**, choisissez **GitHub Actions**.
3. Dans **Actions**, lancez « Déployer l’application ADVF » si nécessaire. Le lien public apparaît à la fin du déploiement.

Les apprenants ouvrent ce lien sans compte GitHub. Le workflow suit la [documentation officielle GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Utilisation locale

Ouvrez `index.html` dans un navigateur récent. Pour une sauvegarde locale stable, préférez le lien hébergé ou un serveur local : `python -m http.server 4173`, puis `http://localhost:4173`.

Sans React ni Vite : aucune installation nécessaire et aucun chemin de base à configurer. Tous les chemins sont relatifs, compatibles avec un dépôt GitHub Pages dans un sous-dossier. `node verify.cjs` vérifie le contenu et le modèle de session ; `node build.cjs` prépare `dist/`.

## Règles pédagogiques

- Réponses libres, aucune note et aucune comparaison approximative de mots-clés.
- Corrigé chargé et affiché uniquement après confirmation de la validation finale. Les réponses sont ensuite figées.
- Le document apprenant contient un exemple résolu dans l’exercice 2 : il est conservé et signalé comme exemple.
- La case « oui » déjà cochée pour Respirer dans le document apprenant est rappelée sur la première fiche de l’étude de cas et dans le PDF.
- Le corrigé ne coche aucune case de satisfaction pour les situations 5, 6 et 11 de l’exercice 2, pour « Éviter les dangers » et pour le groupe des trois derniers besoins de l’étude de cas. L’application signale ces cases non renseignées et ne déduit aucune correction supplémentaire.
- Les trois derniers besoins sont séparés en trois fiches. La réponse officielle commune est reproduite sur chacune et identifiée comme telle. Les cellules vides restent signalées comme vides.
- Le titre de colonne « Madame V » des documents est une incohérence avec le récit de Madame A ; l’interface emploie Madame A.
- Une fiche est complète lorsque les champs nécessaires sont renseignés. Pour un besoin satisfait, aucune aide n’est exigée. En l’absence d’aide technique pertinente, l’apprenant peut l’indiquer en toutes lettres. Ce repère mesure le remplissage, jamais la justesse.

## Données et PDF

Les données restent dans `localStorage`, avec une copie de secours et un message explicite en cas d’échec. Chaque navigateur dispose de sa session. Deux onglets modifiant la même session déclenchent une suspension de saisie pour éviter les écrasements. Il n’y a ni serveur, ni compte, ni synchronisation entre appareils. Sur un appareil partagé, utiliser des profils de navigateur séparés ou effacer les données du site entre apprenants.

L’e-mail est demandé après validation. Il apparaît dans le PDF, sans être envoyé. Le PDF A4 est produit sur l’appareil avec [pdf-lib](https://pdf-lib.js.org/) 1.17.1, fontkit 1.1.1 et la police libre Ubuntu. Toutes les ressources sont incluses localement. Les textes longs sont répartis automatiquement sur plusieurs pages, avec pagination. Les accents français sont conservés ; les caractères hors de la police sont explicitement signalés avec leur code Unicode.

## Fidélité et maintenance

Énoncés et récit : document apprenant fourni. Corrections : PDF fourni, pages 1 à 11, y compris transcription de la dernière page image. `data.js` contient les questions ; `corrections.js` contient la référence officielle. Modifier ces fichiers seulement après vérification pédagogique. Les retours à la ligne du corrigé sont conservés.

Image d’accueil produite avec l’outil intégré de génération d’images : scène réaliste d’une assistante de vie échangeant autour d’un thé avec une femme âgée africaine, dans un intérieur clair. `assets/intro.webp` est la seule image utilisée. Licences des composants libres dans `vendor/`.

## Vérifications

Voir `VERIFICATIONS.md` pour les contrôles exécutés et leurs limites. Le déploiement réel nécessite le dépôt GitHub et l’activation de Pages ; aucune publication sur un compte n’est faite par ce dossier seul.
