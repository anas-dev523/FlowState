import Button from './components/Button';
import Input from './components/Input';
import Logo from './components/Logo';
import AuthLayout from './components/AuthLayout';
import HabitRow from './components/HabitRow';
import VideoRow from './components/VideoRow';
import SettingsIcon from './components/SettingsIcon';
import TrashIcon from './components/TrashIcon';
import PlusIcon from './components/PlusIcon';
import HabitSelector from './components/HabitSelect';
import InfoBlock from './components/InfoBlock';
function DevPage() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

      <section>
        <h2>Button</h2>
        <Button variant="filled">Se connecter</Button>
        <br /><br />
        <Button variant="outline">Créer un compte</Button>
        <br /><br />
        <Button variant="dark">Continue</Button>
      </section>

      <section>
        <h2>Input</h2>
        <Input type="text" placeholder="Nom d'utilisateur" />
        <br /><br />
        <Input type="password" placeholder="Mot de passe" />
      </section>

      <section>
        <h2>Logo</h2>
        <Logo width={80} />
        <br></br>
        <Logo width={160} />
      </section>

      <section>
        <h2>AuthLayout</h2>
        <AuthLayout showBackArrow={true}>
          <p>Contenu enfant ici</p>
        </AuthLayout>
      </section>

      <section>
        <h2>HabitRow</h2>
        <HabitRow name="Méditation" onSettings={() => {}} onDelete={() => {}} />
        <HabitRow name="Journaling" onSettings={() => {}} onDelete={() => {}} />
      </section>

      <section>
        <h2>VideoRow</h2>
        <VideoRow title="Conseils rapides" thumbnail="https://placehold.co/60x45" onSettings={() => {}} onDelete={() => {}} />
        <VideoRow title="Arrête de remettre à demain" thumbnail="https://placehold.co/60x45" onSettings={() => {}} onDelete={() => {}} />
      </section>

      <section>
        <h2>Icons</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <SettingsIcon size={20} />
          <TrashIcon size={20} />
          <PlusIcon size={24} />
        </div>
      </section>
      <section>
        <HabitSelector onConfirm={(selected) => console.log(selected)} />
      </section>
    <section>
      <InfoBlock text ="hello"/> 
    </section>


    </div>
  );
}

export default DevPage;
