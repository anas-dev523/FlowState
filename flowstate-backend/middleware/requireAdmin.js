const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const requireAdminMiddleware = async (req,res,next) =>{
try{
    const userId = req.user.userId;
    const  user = await prisma.utilisateur.findUnique(
        {where :{ id_utilisateur: req.user.userId}}
    )
    if (user.role !== 'admin' ) {
      return res.status(403).json({
        error: 'Accès refusé.'
      });
    }
    next();
}catch(error){
console.error('Erreur d\'authentification:', error);
    return res.status(403).json({
      error: 'role pas autorisé'
})
}}
module.exports = requireAdminMiddleware;
