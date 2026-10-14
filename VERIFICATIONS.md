# Vérifications du 14 octobre 2026

- Contenu : 30 + 24 situations, 14 besoins, numérotation continue, 11 paragraphes du récit (dont les quatre plages d’intervention), exemple résolu conservé.
- Corrections extraites du PDF et dernière page image transcrite ; cellules continuées d’une page à l’autre réunies, réponses multiples conservées, cases de satisfaction vides signalées sans déduction.
- Parcours effectué sur les 68 fiches dans Chrome, avec affichage mobile de 390 px et contrôle complémentaire à 320 px. Réponses saisies, retour aux questions, reprise après rechargement, annulation puis confirmation finale.
- Aucune image dans les exercices ; une seule image sur l’accueil.
- Aucun chargement du corrigé avant confirmation ; réponses figées après validation, comparaison de satisfaction seulement pour les cases explicites.
- Deux contextes de navigateur séparés : aucune identité ni réponse partagée.
- Sauvegarde et restauration testées, ainsi que le modèle de remplissage des champs conditionnels. Sauvegarde corrompue récupérée depuis la copie de secours ; stockage bloqué simulé avec réponse conservée en mémoire et message explicite. Validation d’un travail incomplet vérifiée.
- PDF généré par l’application dans le navigateur, récupéré à partir du document produit et contrôlé : 54 situations + 14 besoins, identité, e-mail, récit, corrections, accents et pagination. Une réponse de plus de 4 000 caractères, dont un mot très long, a été conservée jusqu’à son dernier marqueur.
- Contrôle des marges sur toutes les pages et inspection visuelle de pages représentatives du PDF, de l’accueil et d’une fiche sur mobile, ainsi que de l’accueil sur ordinateur.
- Syntaxe JavaScript et contrôles `node verify.cjs` réussis. Fichiers statiques assemblés dans `dist/`, chemins relatifs compatibles avec un sous-dossier GitHub Pages.

## Limites explicites

Le navigateur automatisé de cet environnement annule les téléchargements de fichiers. La génération PDF et le contenu du fichier produit sont vérifiés, mais l’enregistrement par le gestionnaire de téléchargements doit être confirmé dans un navigateur habituel.

Le workflow GitHub Pages est préparé selon la documentation officielle actuelle ; un déploiement distant n’a pas été exécuté, aucun dépôt de destination n’ayant été fourni. Les tests mobiles utilisent l’émulation de taille d’écran de Chrome ; aucun test sur appareil Android ou iPhone physique n’a été effectué.
