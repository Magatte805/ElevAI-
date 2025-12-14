# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Inscription" [level=2] [ref=e4]
  - paragraph [ref=e5]: Erreur serveur ou réseau. Veuillez réessayer.
  - generic [ref=e6]:
    - text: Username
    - generic [ref=e7]: "*"
    - textbox "Username *" [ref=e8]:
      - /placeholder: Username
      - text: testuser
  - generic [ref=e9]:
    - text: Mot de passe
    - generic [ref=e10]: "*"
    - textbox "Mot de passe *" [ref=e11]:
      - /placeholder: Mot de passe
      - text: "123456"
  - textbox "Âge" [ref=e12]: "28"
  - textbox "Poids" [ref=e13]: "74"
  - textbox "Taille" [ref=e14]: "178"
  - textbox "Genre" [ref=e15]: Homme
  - textbox "Objectif" [ref=e16]: Améliorer le sommeil
  - button "S’inscrire" [active] [ref=e17] [cursor=pointer]
```