import Image from 'next/image'
import Button  from '../components/Button'
import Inputs from '@/components/Inputs'

const Home = () => (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <Button size='lg'/>
    <Inputs type='email'label= 'Email'variant='underlined' placeholder='Ingrese un correo' regex='/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/' />
  </main>
)

export default Home
