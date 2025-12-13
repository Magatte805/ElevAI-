# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - heading "ElevAI" [level=1] [ref=e6]
      - navigation [ref=e7]:
        - link "Profil" [ref=e8] [cursor=pointer]:
          - /url: /login
        - link "Saisie" [ref=e9] [cursor=pointer]:
          - /url: /add-entry
        - link "Dashboard" [ref=e10] [cursor=pointer]:
          - /url: /dashboard
  - main [ref=e11]:
    - generic [ref=e13]:
      - heading "Créer / Modifier mon profil" [level=2] [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - text: Âge
          - spinbutton "Âge" [ref=e17]
        - generic [ref=e18]:
          - text: Genre
          - combobox "Genre" [ref=e19]:
            - option "Choisir..." [selected]
            - option "Homme"
            - option "Femme"
            - option "Autre"
        - generic [ref=e20]:
          - text: Taille (cm)
          - spinbutton "Taille (cm)" [ref=e21]
        - generic [ref=e22]:
          - text: Poids (kg)
          - spinbutton "Poids (kg)" [ref=e23]
        - generic [ref=e24]:
          - text: Objectif
          - textbox "Objectif" [ref=e25]:
            - /placeholder: "Ex: Perdre du poids, mieux dormir..."
        - button "Enregistrer le profil" [ref=e26] [cursor=pointer]
```