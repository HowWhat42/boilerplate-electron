import router from '@adonisjs/core/services/router'

router.get('/api/notes', [() => import('#app/core/controllers/notes_controller'), 'index'])
router.post('/api/notes', [() => import('#app/core/controllers/notes_controller'), 'store'])
