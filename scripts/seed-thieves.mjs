import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Charger .env.local manuellement
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => {
      const [key, ...rest] = line.split('=')
      return [key.trim(), rest.join('=').trim()]
    })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_USER_ID = '076feef1-e277-47b3-af7f-9aab836c82ee'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Variables manquantes dans .env.local')
  process.exit(1)
}

const rawData = `@(1)alec_scie	Wecards weward / Wecard gla / Gladys Sevrard
@23johan27	Johan herbet
@306bob	Francine Rinefa / Thoùas Pauly / att
@aaron974	Haroun Tim
@absolu7	Gobillot ludo / Ludivine absol / Itachi Uchiwa / Ju
@adelinejoron13	Adeline joron
@aessandro1982	Alessandro Cesario
@agoo5	Sylvi agostini
@aguilerao	Neldo
@aiskander2019	Javier Martinez / Angeles chicote
@alban.mayeux	Alban Mayeux
@alessandraielussig1987	Alessandra lelussig
@alexandredas	Alexandre dasilva
@alexandregolf4	Alexandre dasilva
@alexesn	Alexandre esnault
@alexis.beirnaert	Alexis Beirnaert & Maxime Vandevregen
@alexperso16	Alexis trompat
@alexpierre	Alex Pierre
@amcastro689	Antonio castro
@amélie02	Réseau Barbier
@ancastro689	Castrum anthos / Sookie Castro / Leha Laurent
@andrea067	Andrea alves
@andrea2602	Andrea Furto Greg
@andresara89	Andrea Vadala
@angchcte2019	Javier Martinez / Angeles chicote
@angelinadc	Olivier Mahina / Pseudo proche de @angélinadc
@Angélinadc	Antoine Guyot / Ution de @foodizlife45 (compte weward safe)
@angry_89	Amanda pergotti / Paolo Brusetti / Paeola Netti
@anitac25	Catina Morandini
@annalisa090	Pamela Clemente / Annalisa terzia / Matteo colato
@ansepat1	Patachou pat; Patricia Tonon; anse pat
@anthony5177	Eyes eyes
@anthonyght	Anthony gauthier / Marie claire Obd
@antoine.bonnet44	Martin laporte / Hugo Helary
@antolaurent	Castrum anthos / Sookie Castro / Leha Laurent
@antoniofesta83	Antonio festa
@apologie	Usurpateur
@aria1988	Justin Resus / Kevin Vks / Kevin Stulove / Kevin Haka
@arnaud740	Goliath dom
@art2020	Steph art
@arthur.polkiro10	Martin laporte / Hugo Helary
@arthur.polkro10	Martin Laporte / Hugo helary
@athenastaffy	Francine Rinefa / Thoùas Pauly / att
@att39	Francine Rinefa / Thoùas Pauly / att
@aur.anouilh	Aurelie Anouilh
@aurelie.anouilh	Aurelie Anouilh
@aurelie.deransy	Aurély Deransy / petitchat desbois
@aurelien922709011	aurelien
@aurely62400	Aurély Deransy / petitchat desbois
@aurora_stella	Aurora cli / Sara zanchi
@avahoreo2	Gilles Benhayoun
@aydin	Zrk sang blanc
@aymeer	Kevin pereira
@azeweward	Lolo Richo
@B.n54	Réseau Barbier
@baba2012	Bastien Bourdon
@baltrou	Salva Lasio & Tony Ferreira
@baltrou10	Salva lasido / Tony Ferreira
@banca	Romain Desclos
@barbiche67	Didier barbier
@beneddine14	Beneddine oussama
@benji1212	Benjamin Balabaud
@benji121205	Benjamin Balabaud
@berlingot25	Blandine biais
@biltoki	Elodie Bellegoeuille
@blanchecolombe77	Antoine Guyot / Usurpation de @foodizlife45 (compte weward safe)
@bogoss59250	Weward france / Emilie la delfa / este este / guapo guapo
@Bonito44	Mathou m / Mathieu framier / Mick malio
@bossicard1291	Laure Minet / Francois minet
@bottiglierisara00	Sara botti
@bouchondu38	Cathy cat
@Bouyoug	Salva Lasio & Tony Ferreira
@Boxindi	David Borrero
@brandon711	Christine Yannick
@brian_1990	Didier motard / Brian vivant / Alexis Alexis / Mathieu Drl
@brpaul	Mimi simon2600 / Pauline Merle / Paul Boudois
@byyreals	Byy reals relié à la famille cinar
@caarlarc	Christophe lnx / Christian Prévot
@caccacrice.leonessa2004	Laine Fuoa / Francesca Spinelli
@calebsutton	Caleb sutton
@calme_attitude59	Noah Ledattre / Mick Lnrt / MIck / Maxime Marineaud / Estelle Delattre / Mika majestueux / Mika maestro / Menu lienhardt Micka
@camille7744	Camille Tipipookvaiäna (demande de dons)
@camille89fr	Camille Becker
@camillebecker480	Camille Becker
@capipauli	Basti davide / Jennifer hinze / Paul brunner
@carl.c	Ca rl & Carl clws
@carl_rcl	Ca rl & Carl clws
@carla32	Barbara Trico & Carla Subaro & Roberta ciglia & Lucia spiglia
@castrese85	Luigi colombo / Castrese di maro / zipee
@castro81	Castrum anthos / Sookie Castro / Leha Laurent
@cathy.perry328	Cathy Perry
@cauhapelaetitia3	Cauhape Laetitia
@cednico419	Gobillot ludo / Ludivine absol / Itachi Uchiwa / Ju
@cedric.lozan87	Cedric loza / Yvon Lozano / Philipe Cornille
@celine.caron.73	Céline caron
@cerfvoltant77	Greg dupt / Vlad bronislavovych / flo Px
@cesca72	Nina mina
@cesterdeterni	Carlo conti
@Charlie_le_kiki	Lucas stave ierrot Migard
@chateigner7424	Fredericc ciaco / Marie Franconi / Nicolas Dumesnil / Alonzo striopa / Jordan Gulley /Mickael Page
@chevreuilsauvage	Thomas evrad / Juju bauer
@chocolat974	Tii mel & Pascali75794476 (twitter)
@choubidouwi	Mylene Maily
@choups80	Valentine etroit
@christopje.ligny	Christophe Ligny
@cindy.burret37	Cindy Burret
@cioppy123	Paoli netti / paolo brusetti
@claudenadege85	Nadage Mty Clode
@clem85880	Clément jourdain
@clio76	Rebecca Demaro
@coeurnoir35	Michael mika
@combespaul31	Paul combes
@cornille.phil87	Cedric loza; Yvon Lozano; Philipe Cornille
@cricri013	Christelle Dupont
@cris.totof3	jean Christophe riviere
@cris.totof331	jean Christophe riviere
@cruuat	Claire Derval / Claire Claude
@curry23	stephane vaisselet / Lee John
@d.loris66	Gmlv dev
@damien1967	Amanda pergotti / Paolo Brusetti / Paeola Netti
@danielelopetuso	Daniele lopetuso / Luca Carrassi
@danimm721	Daniel Martinez Alpanez
@dany1	Pukay netrun krüt / Laurence roumier / Fenasi Kerim / Bernhard Staubmann / Danilo Rossi / Yup Turk
@daskro2772	Andrea Veronesi; Mario berti; Serranti arturo; Tania Verdelli; Cleo Martelli; Maurizio perrotta; Walter aide; Vera tuci
@dav.esp7629	Liedav
@davcus99	Davide Cusimano
@davide26	Davide Cusimano
@dawn0105	Basti davide / Jennifer hinze / Paul brunner
@degrute_macadam	Mathou m / Mathieu framier / Mick malio
@devi76	Liedav
@devi76290	Liedav
@diaz.2000	Diaz Diego
@dimothai	Odette Dovet / Nicolas Dumesnil
@dimsou356	dimitry mhr
@dindane53	Jordan Cousin
@dineros1990	Garcon Solide
@djo_57270	Jonathan Djo Parasecoli
@dolfin77	Eyes eyes
@domaud33	Dominique audrain
@dreams60000	Stephen belval
@dreamwhite	Greg Gtle
@dstorn87	Odette Dovet / Nicolas Dumesnil
@duhamelgregory5	Greg locks / John Dillinger / Gregory duhamel
@dupuisj059	Justine dupuis
@dve2000	Diego Blanchi esposito
@dweez	Guillaume giraud
@e.banana	Este goatt
@egsteban	Etienne Grelard (envoi mauvaise carte)
@eiffeltower	Playsir eps
@elbulo1981	El bulo / Jami no / Jomi no / Miguel Goncalves
@elcruce21	Major sergio / Nexbrny / Teodoro Sp / Bryan.431559 / Manolo garcia / Pepe garcia Garcia Pepe / Cervera cervera garcia / Manuel cervera garcia / Jose jose
@elguapo17310	Weward france / Emilie la delfa / este este / guapo guapo
@ellosroflora	Ellosro flora
@elodiebellegoeuille	Elodie Bellegoeuille
@elodieminette	Elodie Morisse
@emflowers07	Quentin Io / Summer Wendy
@emi59250	Weward france / Emilie la delfa / este este / guapo guapo
@Erosmetal3	Erasmo di natale
@este0213	Weward france / Emilie la delfa / este este / guapo guapo
@esteban.paus	Este goatt
@estrelladimaria	Antoine Guyot / Usurpation de @foodizlife45 (compte weward safe)
@evele	Evelyne baum
@fabiennealexandre48	Fabienne brun
@fabiodp25	Fabio di palma (propose H9 alors qu'il ne la pas)
@fabrice62	Florian hcht / Florian hochart
@fandeyamal	Weward france / Emilie la delfa / este este / guapo guapo
@fanny1982	Stéphanie Chalumeau
@Faylyberel	Fan ny
@fckthepain	Dumè Away / Coke liko
@feder.1	Alessandra Cantoni
@felix.from.france	Louis Delarue / Louis defrance / wewardeuroff card / Louis rx
@fito76	Alonzo striopa / Nicolas dumesnil / Nicolas Dml / Yoann fournier / Daniel storn
@flavielyoutte	Flavie Marrot
@fleurbleue1957	Hubert danielle rose
@flo.pnn	Florian Pinon
@flomaridom	Florence Maridom
@flonit	Andrea carganico
@floox19	Florian hcht / Florian hochart
@flopofran	JF (instagram @tigger010)
@florian.hochart19	Florian hcht / Florian hochart
@florianhcht	Florian hcht / Florian hochart
@flow06530	Etienne Delacre
@Flxhiker	Jenn Hargrave
@foodzlike45	Antoine Guyot / Usurpation de @foodizlife45 (compte weward safe)
@fpd25.commerciale	Fabio di palma (propose H9 alors qu'il ne la pas)
@fraises19	Laure Minet / Francois minet
@francesca.camagni	Nina mina
@francesca.spinelli	Laine Fuoa / Francesca Spinelli
@francketisabelle	Martin Laporte / Hugo helary
@francki13	Franck chabanon
@francky69	Franck chabanon
@francoisduval	Laure Minet / Francois minet
@franflopo	JF (instagram @tigger010)
@fred.from.calais	Louis Delarue / Louis defrance / wewardeuroff card / Louis rx
@fred.from.france	Louis Delarue / Louis defrance / wewardeuroff card / Louis rx
@fredat7	Thierry Weisse
@fredericweisse8	Thierry Weisse
@fredlentini	Fred lentini
@fredodirocco	Fred Vincendon-duc
@fredopetank	Jerome legrand / casanova Mickael
@fredou73190	Camille Tipipoolvaïana
@freier.vogel01	Basti davide / Jennifer hinze / Paul brunner
@froufroufrou	Gustave Sarrot
@ftibtb	Lilouch boutou / Lilouch btb / fti btb
@ftitb	Lilouch bouton / Lilouch btb / fti btb
@fulminebenedic	Claudiu benedic
@gaetan1290	Gaetan Grillot
@Galatasaray38	Pukay netrun krüt / Fenasi Kerim / Bernhard Staubmann / Danilo Rossi / Yakup Turk
@gefa16	Lucrece jam afane / Loulouby Gucci
@Gilgro	Valentin K'mus
@giovannettis114	Maria Mary / Marika Criscito (propose H9 mais n'a pas)
@Gireylina	Lina Gerey
@giu17	Giuliana Castaldo (attention méfiance) / Stella
@giulismarri98	Sara botti
@giuly17	Giuliana Castaldo (attention mance) / Stella
@giuseppe.valerio321	Paolo valerio
@giusy24	Barbara Trico & Carla Subaro & Roberta ciglia & Lucia spiglia
@gla102426	Wecards weward / Wecard gla / Gladys Sevrard
@gladysevrard	Wecards weward / Wecard gla / Gladys Sevrard
@gladysiator	Wecards weward / Wecard gla / Gladys Sevrard
@glds_vrd	Wecards weward / Wecard gla / Gladys Sevrard
@gloralex	Jerome Marien
@gppierantoni	Gian paolo pierantoni
@gramsci2399	Giovanni Ferraro
@Grinch2602	Lia Giroletti
@guillaume1993	Guillaume Coquillaud
@guillome51470	Rob guillaume
@guillome51520	Rob guillaume
@gwen05	Gwendoline fontaine
@gwendo19	Glb
@Haizakifinito	Quentin Io / Summer Wendy
@Hardypaul730	Keylian Shmith / Paul Hardy / Lucas chevaler / thomas du bois / Nathan Le roy / Jonathan Petit
@haroun_974	Haroun Tim
@harveyspecter10	Harvey (insta)
@heleli1165	Pamela Clemente / Annalisa terzia / Matteo colato
@hellaso	Andrea carganico
@herrera23	Jordi Herrera
@homdie	Char lie
@homer85	Ciro di marzio / Castrese Dimaro / Jack lamela utilisépar Zipee / Zipee
@honigkuchenpferd123	Lisa kopp
@hono2897	Hono rine
@houssinbakkali	Instagram / Ilyass kharmiz
@hugo.helary	Martin laporte / Hugo Helary
@hulin.olivier.76	Olivier hulin
@hunterblair675	Hunter Blair
@huraultstephane1	Stephane hurault
@hygo.helary_64	Martin Laporte / Hugo helary
@ilsindaco26	Davide Cusimano
@ilyasskharmiz	Instagram / Ilyass kharmiz
@Ilyes.akr	Bi bou (faux screen H9)
@Iryna.d	Iryna Dovbush
@isabelle40230	Isabelle Dubois
@j.bouboule	Clara bouly / cruaut desplangue
@jadeggr	Jade geiger
@Jclio	Jclio clio
@jdtunison	Hunter Blair
@jeanjeanpierre	Jean pierre demay / lié à Aurelie Anouilh
@jefa22	Lucrece jam afane / Loulouby Gucci
@jennifer200394	Jennifer plat
@jeromebce80	Bce jerome
@jess31340	Jessica nini flo / jessica amador
@jim090	manon Pierre / Manon Prt / Lalou lalou
@jl.parraesteso	Luis Parra Esteso
@john_dillinger.187	Greg locks / John Dillinger / Gregory duhamel
@johnsnow23	stephane vaisselet / Lee John
@jojo54360	Johan castellan
@joladouile08	Joffrey Colaiani
@Jominogo1981	El bulo / Jami no / Jomi no / Miguel Goncalves
@Jonattlo66	Gmlv dev
@Jonwedd	Salva Lasio & Tony Ferreira
@jordan_34280	Jordan barthelemy
@joserga81	Major sergio / Nexbrny / Teodoro Sp / Bryan.431559 / Manolo garcia / Pepe garcia Garcia Pepe / Cervera cervera garcia / Manuel cervera garcia / Jose jose
@jouer_0456	Noah Ledattre / Mick Lnrt / MIck / Maxime Marineaud / Estelle Delattre / Mika majestueux / Mika maestro / Menu lienhardt Micka
@joute24	Julien Fremin
@jpdemay	Jean pierre demay / lié à Aurelie Anouilh
@ju162	Gobillot ludo / Ludivine absol / Itachi Uchiwa / Ju
@judechlt	Jude Bdl-Chlt
@juju.dt	Brian Bücher
@jujubauer08	Homme petit / Petit homme
@jujumoisson	Christophe lelinx / Christian Prévot
@Julie.eluau	Li luo
@julien2105	Romain Desclos
@julienguisseau2	Julien guisseau
@julienmonseu27	Julien Monseu
@justeunefrite	Olivier Mahina / Pseudo proche de @angélinadc
@justeunegarde	Olivier Mahina / Pseudo proche de @angélinadc
@justine111	Alexis Beirnaert & Maxime Vagen
@justinoa	Magda magda / Hakuna matata / Ju fever
@K.yildiz	Pukay netrun krüt / Fenasi Kerim / Bernhard Staubmann / Danilo Rossi / Yakup Turk
@karim.ar	Karim ar / Karim safwan souleyman
@Karimdegs	Karim ar / Karim safwan souleyman
@karma775	Joh Wlf
@Kayliah.cadinotbonni	Kayliah cadinot
@kenz733	Flo rent (pas donné orlinski 9 contre été 9 à Ioann debled)
@kerizsilken	Pukay netrun krüt / Laurence roumier / Fenasi Kerim / Bernhard Staubmann / Danilo Rossi / Yakup Turk
@kevincarro6	Piero artista / Kevin Ciarrochi / participant anonyme 784
@kevinest.noir	Lucas stave & Pierrot Migard
@kikketto1985	Francesco miralli
@Kimkimreal59	Zina zina (dit qu'elle a H9)
@koala1967	Alfredo nobre placido
@kristy28	Pamela Clemente / Annalisa terzia / Matteo colato
@laboufle	Benjamin bouflet
@lacroix57	Marc heydt
@lacroixluckas8	Lu lu / lu4
@laeti38470	Cauhape Laetitia
@laetitia.59760	Laetitia Dk
@lapierro29	Pierre le reste
@laprize	Ymere negir
@lauraprs76	Laura Paris
@leaa.abarth	Leaa fl / Leaa leaa
@lechon.matthias	Mathias Lechon
@lee_corne	Lee corne
@lehugue.64	Martin Laporte / Hugo helary
@lelynx	Christophe lelinx / Christian Prévot
@Leo.2012	Lait eau / Escalade parkour / Leo Chantier / Parkour salto
@Leo.222	Lait eau / Escalade parkour / Leo Chantier / Parkour salto
@leo812	Major sergio / Nexbrny / Teodoro Sp / Bryan.431559 / Manolo garcia / Pepe garcia Garcia Pepe / Cervera cervera garcia / Manuel cervera garcia / Jose jose
@leon812	Teodoro Sp / Manolo garcia / Jose jose / jarod philippe
@lerestepierre	Pierre le reste
@lezcrea	Elodie Bellegoeuille
@lezink	Cyrille Ldre / Lalandre
@liagiroletti26	Lia Giroletti
@Lili.72	Li luo
@lilibauwens4	Lili bauwens
@lilouchboutou	Lilouch boutou / Lilouch btb / fti btb
@Lionel.cucchi2a	Lionel cucchi
@Lioneldu2a	Lionel cucchi
@lisia1411	Theo Proyart & Lisa cpplr
@lo.rosel	Richard collegue
@loogik	Loic Braun
@lorenzobottalico04	Lorenzo bottalico
@louis.from.france	Louis Delarue / Louis defrance / wewardeuroff card / Louis rx
@louisrdx2	Louis Delarue / Louis defrance / wewardeuroff card / Louis rx
@louloup.7643	Valentine grenet; Didier motard; Brian vivant; Alexis Alexis; Mathieu Drl
@loulouu5	manon Pierre / Manon Prt / Lalou lalou
@lozano.cedric87	Cedric loza / Yvon Lozano / Philipe Cornille
@lr.doris.panel	Doris Pane
@lu_06130	Lu lu / lu4
@lu4_066	Lu lu / lu4
@lucasboulet12	Lucas boulet
@lucasgrs	Pierre gauchet / Lucas grs
@luffy88	Justin Resus / Kevin Vks / Kevin Stulove / Kevin Haka
@lukedu33	Luke morganti
@lulu	Sarah Windrestin / Laya bertholozzi / Au rélie / lulu lucie / Aurelie lucquiaud
@luluebibie	Luluee biibiiee
@lyalmr6	Lya mns
@lydia_lordel	Clara Fourcade & Ryan Soupakrou
@m.vds	Marc vanderstichele
@macaron_pistache	Noah Ledattre / Mick Lnrt / MIck / Maxime Marineaud / Estelle Delattre / Mika majestueux / Mika maestro / Menu lienhardt Micka
@macerga81	Major sergio / Nexbrny / Teodoro Sp / Bryan.431559 / Manolo garcia / Pepe garcia Garcia Pepe / Cervera cervera garcia / Manuel cervera garcia / Jose jose
@madrid17	Mathias lepaul / Louis vigneron / fvrouk azal / zak azal
@maelysgautier404	Maelys Gautier (10 comptes facebook)
@maelysgautier48	Maelys Gautier (10 comptes facebook)
@maelysgautiergautier	Maelys Gautier (10 comptes facebook)
@Maikel9	Major sergio / Nexbrny / Teodoro Sp / Bryan.431559 / Manolo garcia / Pepe garcia Garcia Pepe / Cervera cervera garcia / Manuel cervera garcia / Jose jose
@malaga15	Marco Semama
@malgautier56	Maelys Gautier (10 comptes facebook)
@manonpierret230	manon Pierre / Manon Prt / Lalou lalou
@marc.heydt67500	Marc heydt
@marco.semama	Marco Semama
@marco45	Francesco cesarin / franco cerchi
@Marcoopera	Antonio festa
@marika_95	Maria Mary / Marika Criscito (propose H9 mais n'a pas)
@Marinette7713	Maryne Pippin's
@Marion.rousselot7	Marion Rousselot
@Marixsmarixs	Maria Mary / Marika Criscito (propose H9 mais n'a pas)
@Marjoulle_1981	Marjorie Brl
@Marseillais5793	Gabriel Maree (envoie pas toutes les cartes)
@marti.romecki	Martin Romecki
@martin_randoux	Louis Delarue / Louis defrance / wewardeuroff card / Louis rx
@maschaundderar	Basti davide / Jennifer hinze / Paul brunner
@mat93	Valentine grenet; Didier motard; Brian vivant; Alexis Alexis; Mathieu Drl
@matfer0401	Matheo Ferber & Maxime lopez
@mathieu.chapuy11	Mat CHP
@mathieu456	Darius Rockets / Ethan Pointuer
@mathilde.chauvac	Mathilde chavv / Mathilde chauvac
@mathis.mounet	Martin laporte / Hugo Helary
@Matsiuki	Didier motard / Brian vivant / Alexis Alexis / Mathieu Drl
@maubert	Basti davide / Jennifer hinze / Paul brunner
@max.barbier54000	Réseau Barbier
@maximeoeh6244	Maxime Oehlschlagel
@mc1102	Murielle Courtois
@mederic1.dard	Mederic mederic / Christel dard
@melichou_	Luke morganti
@melissalobry1210	Mél lby
@merguez05	Bryan Brucher
@Mgautier56	Maelys Gautier (10 comptes facebook)
@mgautier840	Maelys Gautier (10 comptes facebook)
@miasimon	Mimi simon2600 / Pauline Merle / Paul Boudois
@michel.guillaums	Michel guillaums / Mikel Guilliaums
@Michelino9	Antonio Picone
@michi1	Michael Stein / Bernhard Staubmann
@michi3793	Michael Stein / Bernhard Staubmann
@michi55	Fabio Gaudino
@Micklepicard	Regis Carlier
@micky36	Paoli netti / paolo brusetti
@mikelguilliaums	Michel guillaums / Mikel Guilliaums
@millo07	Simone Caschera / Luciano Pastore / Stefano rossetti / Pergolesi sandro / Riccardo falco / Tommaso viola / Falco macigno
@mimielc	Anne-Marie Leclanche
@missclick	Mathias Lepaul / Louis vigneron / fvrouk azal / zak azal
@Missleaa	Leaa fl / Leaa leaa
@mistertennis123	Amanda pergotti / Paolo Brusetti / Paeola Netti
@mj23	stephane vaisselet / Lee John
@modz	Christophe lelinx / Christian Prévot
@mona94	Attention usurpation d'identité facebook / Marie retale / Marie frafale / Laetitia Droma
@montre_autoique	Noah Ledattre / Mick Lnrt / MIck / Maxime Marineaud / Estelle Delattre / Mika majestueux / Mika maestro / Menu lienhardt Micka
@monyca.2972	Laine Fuoa / Francesca Spinelli
@morfeo_24	Jordi Herrera
@morganti	Luke morganti
@mscmml95_	Emanuele Mascagna
@mygnancy1	Pierre Gauchet / Mylene Mallet / Patricia Schaeffer
@n.barbier54	Réseau Barbier
@nadege.claude85	Nadage Mty Clode
@nandosauze	Nando Sauze
@nanoupeachoupette82	Anne nanou mercier (propose H9 mais ne la pas)
@natalino93	Natale Emmanuele
@nathael38920	Nathael faure
@nathalie.barbier01	Alexis Beirnaert & Maxime Vandevregen
@Nathalie.barbier543	Réseau Barbier
@nathaliefalluel1969	Marie vitis / Nathalie Falluel
@nene266	Pamela Clemente / Annalisa terzia / Matteo colato
@nick_bis19	Nicolo monopoli
@nico.jill	Nicolas jill
@nikkodml	Fredericc ciaco / Marie Franconi / Nicolas Dumesnil / Alonzo striopa / Jordan Gulley /Mickael Page
@niotoo	Antonio Da cruz
@Noraa12	Nora Pereira
@nuno73000	nuno teixeira
@nymeria1011	Paul canivet / Natacha rouland
@objectif15k	Nicolas jill
@occhidigatto	Barbara Trico & Carla Subaro & Roberta ciglia & Lucia spiglia
@Oceane.guerin24	Oceane Guerin
@ogustine	Jerome Marien
@okamikr	Pierre Hinard
@Olivier75	Olivier Dupuis
@olivierg67	Gauthey olivier / Olivier Gauthey
@oliviergauthey160	Gauthey olivier / Olivier Gauthey
@Om.pj	Pierre Josselin PJ
@orkunkokcu	Pukay netrun krüt / Laurence roumier / Fenasi Kerim / Bernhard Staubmann / Danilo Rossi / Yakup Turk
@Orl39	Multiples usurpations / Floriane legrand / Wilson / David loft / Jean leroy / Alfred petit / Reglo man / Johnn Vieterland / Mazer Atti
@ortega21	Major sergio / Nexbrny / Teodoro Sp / Bryan.431559 / Manolo garcia / Pepe garcia Garcia Pepe / Cervera cervera garcia / Manuel cervera garcia / Jose jose
@pablo123	Juliette pointier / Noe Delacour / Elisa Dupont / Manon lettoos
@pachou	Sonny pache
@parapanda	Major sergio / Nexbrny / Teodoro Sp / Bryan.431559 / Manolo garcia / Pepe garcia Garcia Pepe / Cervera cervera garcia / Manuel cervera garcia / Jose jose
@pascaline1993	Tii mel & Pascali75794476 (twitter)
@patachou19	Patachou pat / Patricia tonon / anse pat
@patatavolante	Greg dupt / Vlad bronislavovych / flo Px
@patnad	Patrick bernard
@patougoupil33	Ricardo Pierre / Ranginui tangaona / Julie Julie / Ricard Collègue / Patrice goupil
@patoune1024	Paul canivet / Natacha rouland
@patricegoupil33	Ricardo Pierre / Ranginui tangaona / Julie Julie / Ricard Collègue / Patrice goupil
@Pattyca	Pattyca Callacando
@Paul100411	Keylian Shmith / Paul Hardy / Lucas chevaler / thomas du bois / Nathan Le roy / Jonathan Petit
@paulbourdois	Mimi simon2600 / Pauline Merle / Paul Boudois
@paulcmbs	Paul combes
@peinturlure24	Paul canivet / Natacha rouland
@penelopelepecher	Laure Minet / Francois minet
@pep.vinos.14	Pep vinos
@pepe199	Teodoro Sp / Manolo garcia / Jose jose / jarod philippe
@petitehan127	Darius Rockets / Ethan Pointuer
@phil.cornille87	Cedric loza / Yvon Lozano / Philipe Cornille
@pickashoes	Mika sah
@pierfran96	Pierfrancesco Orsini
@Pierfrancesco	Pierfrancesco Orsini
@pierh59	Pierre Hinard
@pierre.fortin	Pierre aaron fortin
@piluquity50	Pilar rodriguez
@pochocho	Gustave Sarrot
@pommelle	Isabelle Agavios
@poupette87	Jacques Ring
@praga9mimanca	Piero artista / Kevin Ciarrochi / participant anonyme 784
@provato	Ciro di marzio / Castrese Dimaro / Jack lamela utilisé par Zipee / Zipee
@pscl	Alex Pierre
@quelaneige	Tarkan Keles
@quelaplue	Tarkan Keles
@Rafasilva	Pukay netrun krüt / Laurence roumier / Fenasi Kerim / Bernhard Staubmann / Danilo Rossi / Yakup Turk
@rain24	Fredericc ciaco / Marie Franconi / Nicolas Dumesnil / Alonzo striopa / Jordan Gulley /Mickael Page
@raizen_90	Kevin Navarro Sanahuja
@ratagaz	Kevin Lang
@redouane26	Redouane kylcsar
@reitakyo	Amanda escanuela corral
@rekyoporta	Amanda escanuela corral
@retni02	Andrea Veronesi; Mario berti; Serranti arturo; Tania Verdelli; Cleo Martelli; Maurizio perrotta; Walter aide; Vera tuci
@rk26	Redouane kylcsar
@robertfer675	Matheo Ferber & Maxime lopez
@robincoco	Corinne robin
@rom.barbier05	Romain Barbier
@roma1992	Phil rouge
@romain13210	Romain llovera
@rosana91	Rosn sn
@rosario1993	Francesco cesarin / franco cerchi
@rose.hubert5414	Hubert danielle rose
@rossinimarcy	Marcello rossini & LunicoMarcelloRossini (insta)
@roxxx93	Francesco cesarin / franco cerchi
@roxy931	Valentine grenet; Didier motard; Brian vivant; Alexis Alexis; Mathieu Drl
@rubio35	Romain Tertrais
@runrun62	Alain renoux
@s_pachou	Sonny pache
@sabine.barbier54	Barbier réseau
@sachataveau051	Sachat taveau
@saintparfait	Jerome legrand / casanova Mickael
@saitama212	Mathiaslepaul / Louis vigneron / fvrouk azal / zak azal
@Salmosteit	Stefao Salmoiraghi
@samouuuu02	Samuel Nrd
@Sampeps69	Samuel ppn / Sam weward
@samushibiscus	Ma sam
@san1970	Sandrine breuil (envoie pas les bonnes cartes)
@sandrine.bonnichon34	cousine de Kayliah cadinot
@sandrine008	Sandrine Roland
@sandrineg54	Sandrine gal
@sara.lay	Aurora cazzoli / Sara zanchi
@sara.zanchi90	Aurora cazzoli / Sara zanchi
@sarabanda	Marco Semama
@Sarahmicheal	Syham Se
@saraho66	Syham Se
@sasukelec	Barbier réseau
@sasult	Réseau Barbier
@Savion87	Andrea spadaro
@Scattamagna	Tony Ynot
@sciacallo	Antonio Picone
@seb23peyrot	Sébastien Peyrot
@segretario	Ciro di marzio / Castrese Dimaro / Jack lamela utilisé par Zipee / Zipee
@segretariop	Amelie millet / zipee
@sertziken	Pukay netrun krüt / Laurence roumier / Fenasi Kerim / Bernhard Staubmann / Danilo Rossi / Yakup Turk
@settantadue72	Simone Caschera / Luciano Pastore / Stefano rossetti / Pergolesi sandro / Riccardo falco / Falco macigno
@Simauto	Denis Frovard & Loiic deloval & Remi dubois & Richard desmette & Maxime tourneuve & Louis holtz & Quentin dejarc & Simon tolsart & Paul louvret
@simonelongo1999	Simone longo
@simsim59520	Denis Frovard & Loiic deloval & Remi dubois & Richard desmette & Maxime tourneuve & Louis holtz & Quentin dejarc & Simon tolsart & Paul louvret
@skop	Salva lasido / Tony Ferreira
@skoparino	Salva Lasio & Tony Ferreira
@skoparino4	Salva lasido / Tony Ferreira
@slevin13	Marcello rossini & LunicoMarcelloRossini (insta)
@snow8	stephane vaisselet / Lee John
@sofiaaaa.20	Alessandra Cantoni
@sophieandlilou	Sophie raitre
@sophieraitre	Sophie raitre
@sosocomando04	Junior wardijunior; Sohan lala; Sohan lacarelle
@souleimaneschiltzz	Souleïmane Schiltz
@sparta1234	Andrea Veronesi; Mario berti; Serranti arturo; Tania Verdelli; Cleo Martelli; Maurizio perrotta; Walter aide; Vera tuci
@specchlo85	Simone longo
@spectre007	Noé st
@spectre127	Noé st
@spider_greg66	Gmlv dev
@stao70	Alonzo striopa / Nicolas dumesnil / Nicolas Dml / Yoann fournier / Daniel storn
@stef5	Girette stéphanie
@steph8307	Stephanie steph
@stephdu49	Stéphanie Chalumeau
@steven_bro_09082008	Steven Brochard
@sussan78	Alberto garcia & Laura
@sylvain1982	Sylvain Adam
@sylviagostini	Sylvi agostini
@sylviahgostini	Sylvi agostini
@sylviedu72	Sylvie chereau
@symiloulou	Romain Desclos
@tara.sakamoto	Ca rl & Carl clws
@tatave	Ricardo Pierre / Ranginui tangaona / Julie Julie / Ricard Collègue / Patrice goupil
@tatoo78	Laura Roussel
@telkie	Telia kineti
@teteil33	Steph art
@teteil33000	Steph art
@teteldu33	Steph art
@thecaramel21	Melanie Barbier
@Thenewclassic69	Camille Tipipoolvaïana
@theoprytt	Theo Proyart & Lisa cpplr
@theresita38	Maryne Pippin's
@thom.bauler	Thomas bauler
@thomaspigiori52	Pingiori Thomas
@tiimel	Tii mel & Pascali75794476 (twitter)
@titiche24	Patrick Serrault
@titounaith	Alexia Blanchard
@toffee26	Sandrine Malaquin
@tony2922	Tony LC
@tonyhyt	Greg Gtle
@toomaatee	Ivan Fernandez Alvarez
@totoletaureau	Tony tout court & Nyto montana
@tour_de_magie	Noah Ledattre / Mick Lnrt / MIck / Maxime Marineaud / Estelle Delattre / Mika majestueux / Mika maestro / Menu lienhardt Micka
@travis.scott	Lucas stave & Pierrot Migard
@trcprz1971	Rebecca Demaro
@Triba11	Barbara Trico & Carla Subaro & Roberta ciglia & Lucia spiglia
@ttmisajourney	Theotime lassa
@ufno93	Alexis Beirnaert & Maxime Vandevregen
@unkut50	Tii mel & Pascali75794476 (twitter)
@val25	Multiples usurpations / Floriane legrand / Wilson / David loft / Jean leroy / Alfred petit / Reglo man / Johnn Vieterland / Mazer Atti
@valentindelair	Valentin delair; Leon duron
@valentine_2009	Valentine grenet; Didier motard; Brian vivant; Alexis Alexis; Mathieu Drl
@valentine2111	Valentine grenet; Didier motard; Brian vivant; Alexis Alexis; Mathieu Drl
@vcathy38	Cathy cat
@verdellita	Andrea Veronesi; Mario berti; Serranti arturo; Tania Verdelli; Cleo Martelli; Maurizio perrotta; Walter aide; Vera tuci
@verona242	Yasmina
@vicksous	Melanie Barbier
@victorestevezmartinez	Simes simes
@viselalune	Patachou pat / Patricia tonon / anse pat
@voleurdu30	Multiples usurpations / Floriane legrand / Wilson / David loft / Jean leroy / Alfred petit / Reglo man / Johnn Vieterland / Mazer Atti
@vulcain91	Eyes eyes
@w.taveau	Sachat taveau
@wardijunior	Junior wardijunior; Sohan lala; Sohan lacarelle
@wardyblack	Cedric loza / Yvon Lozano / Philipe Cornille
@wecardsbank	Lee corne
@wewardpseudo	Lait eau / Escalade parkour / Leo Chantier / Parkour salto
@wic72	Andrea Veronesi; Mario berti; Serranti arturo; Tania Verdelli; Cleo Martelli; Maurizio perrotta; Walter aide; Vera tuci
@xavier.pajewski	Xavier pasdejtski
@xavierbg38300	Xavier nkc (jeu concours fake)
@yaya57720	Yannick beck
@yaya77	Yannick beck
@yoann.barbier54	Réseau Barbier
@yohannjacquet	Yohann jacquet
@yzen	Yzen le bourlay
@zak35212	Mathias Lepaul / Louis vigneron / fvrouk azal / zk azal
@zakady	Zak kay
@zbiboun	Yzen le bourlay
@zeze51	Michael mika
@zkr83	Zrk sang blanc
@zoro88	Justin Resus / Kevin Vks / Kevin Stulove / Kevin Haka`

// Parse et grouper par info (même info = même personne)
function parseAndGroup(data) {
  const lines = data.trim().split('\n')
  const groups = new Map()

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const tabIdx = trimmed.indexOf('\t')
    let pseudo, info

    if (tabIdx !== -1) {
      pseudo = trimmed.slice(0, tabIdx).trim()
      info = trimmed.slice(tabIdx + 1).trim()
    } else {
      pseudo = trimmed.trim()
      info = ''
    }

    pseudo = pseudo.replace(/^@/, '').trim()
    if (!pseudo) continue

    // Clé de regroupement = info normalisée (ou pseudo si pas d'info)
    const key = info ? info.toLowerCase().replace(/\s+/g, ' ').trim() : `__solo__${pseudo.toLowerCase()}`

    if (!groups.has(key)) {
      groups.set(key, { pseudos: [], info })
    }

    const group = groups.get(key)
    if (!group.pseudos.includes(pseudo)) {
      group.pseudos.push(pseudo)
    }
  }

  return Array.from(groups.values())
}

async function seed() {
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  const groups = parseAndGroup(rawData)

  console.log(`📊 ${groups.length} entrées uniques à insérer (sur ~${rawData.trim().split('\n').length} lignes brutes)`)

  const rows = groups.map(g => ({
    weward_pseudos: g.pseudos,
    description: g.info || null,
    status: 'confirmed',
    created_by: ADMIN_USER_ID,
  }))

  // Insérer par batch de 100
  const BATCH = 100
  let inserted = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('thieves').insert(batch)

    if (error) {
      console.error(`❌ Erreur batch ${i}-${i + BATCH}:`, error.message)
    } else {
      inserted += batch.length
      console.log(`✅ ${inserted}/${rows.length} insérés...`)
    }
  }

  console.log(`\n🎉 Terminé ! ${inserted} entrées insérées dans la table thieves.`)
}

seed()
