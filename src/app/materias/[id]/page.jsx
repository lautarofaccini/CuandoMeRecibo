import EditMateria from "./EditMateria";
import NavigationButtons from "./NavigationButtons";

function MateriaPage({ params }) {
  return (
    <section>
      <EditMateria paramId={params.id}/>
      <NavigationButtons paramId={params.id} />
    </section>
  );
}

export default MateriaPage;
