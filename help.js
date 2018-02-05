const commands = module.exports = {
    'aide': `
!aide [command]
   Apporte la page de commande. Passer une commande pour plus d'informations.`,

    'choose': `
!choose <arg1> | [arg2] ...
   Choisit aléatoirement entre le (s) choix fourni (s).`,

    'supr': `
!supr <montant> [options]
   Supprime le <montant> des messages.

   Options:
      [--bots]            : Seulement des messages de bot prunes.
      [--user <name>]     : Élimine uniquement les messages de l'utilisateur spécifié.
      [--filter <string>] : Nettoie uniquement les messages avec la chaîne spécifiée.

      [--pinned | -p]     : Également élimine les messages épinglés.
      [--silent | -s]     : Supprime la commande et n'affiche pas les résultats.`,

    'role': `[Aide role]

!role give <role[,...]>  : Donne un rôle (s).
!role take <role[,...]>  : Supprime le (s) rôle (s).
!role modify <role>      : Modifie un rôle.

#Options
give|take
   [--bots]              : Changer uniquement les rôles pour les Bots.
   [--users]             : Changer uniquement les rôles pour les utilisateurs.
   [--user <user[,...]>] : Modifier uniquement les rôles pour les utilisateurs spécifiés.

   [--inrole <role>]     : Changer les rôles pour tout le monde avec le rôle.
   [--notinrole <role>]  : Changer les rôles pour tout le monde sans le rôle.
   [--noroles]           : Changer les rôles pour tout le monde sans rôle.

modify
   [--name <name>]       : Renommer le rôle.
   [--color <color>]     : Changer la couleur du rôle. (6 digit HEX)`,

    'music': `
[Aide Music]

#_Veuillez_taper : !music [function]

   [play] <Titre musique>  : Ajoute la musique / playlist à la file d'attente.
   [next]                  : Ignore la musique en cours.
   [pause]                 : Met la musique en pause.
   [reprendre]             : Reprend la musique.

   [queue]                 : Affiche la file d'attente de musiques.
   [purge]                 : Efface la file d'attente des musiques.
   [np]                    : Affiche le titre de la musique en cours.

   [vol <0-100>]           : Définit le volume.

   [start]                 : Rejoint votre canal vocal.
   [quitte]                : Quitte le canal vocal.


A effectuer dans un channel #Vocal.`,

    'ban': `
!ban <mention> [options]

#_Interdit_l_utilisateur_mentionne.
Vous ne pouvez pas interdire les utilisateurs dans un rôle supérieur.

   Options:

      [--days <number>]   : Supprime l'historique des messages de l'utilisateur.
      [--reason <reason>] : Spécifie une raison pour interdire l'utilisateur.`,

    'kick': `

!kick <mention> [options]

#_Kicks_l_utilisateur_mentionne.
Vous ne pouvez pas kicker les utilisateurs dans un rôle supérieur.

   Options:
   
      [--reason <reason>] : Spécifie une raison pour kicker l'utilisateur.`

}

