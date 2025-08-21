// Ajoutez ici le code JavaScript pour gérer les interactions, comme la modification et la suppression des éléments
document.addEventListener('DOMContentLoaded', () => {
  // Exemple de gestion des boutons de suppression
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        // Logique de suppression ici
        alert('Élément supprimé !');
      }
    });
  });
});
