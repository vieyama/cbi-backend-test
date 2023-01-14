import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Contact from 'App/Models/Contact'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ContactsController {
  public async index({ request, response }) {
    const { q } = request.requestData

    const contacts = await Database.from('contacts')
      .orderBy('firstname', 'asc')
      .select('*')
      .if(q, (query) => {
        query.where('firstname', 'like', `%${q}%`)
      })

    return response.ok(contacts)
  }

  public async store({ request, response }) {
    const postSchema = schema.create({
      firstname: schema.string({}, [rules.maxLength(255)]),
      lastname: schema.string({}, [rules.maxLength(255)]),
      phone: schema.string({}, [rules.maxLength(14)]),
    })

    const payload: any = await request.validate({ schema: postSchema })
    const post: Contact = await Contact.create(payload)

    return response.ok(post)
  }

  public async show({ params, response }) {
    const { id }: { id: Number } = params

    const post: any = await Contact.find(id)
    if (!post) {
      return response.notFound({ message: 'Post not found' })
    }

    return response.ok(post)
  }

  public async update({ request, params, response }) {
    const contactSchema = schema.create({
      firstname: schema.string({}, [rules.maxLength(255)]),
      lastname: schema.string({}, [rules.maxLength(255)]),
      phone: schema.string({}, [rules.maxLength(14)]),
    })

    const payload: any = await request.validate({ schema: contactSchema })

    const { id }: { id: Number } = params

    const contact: any = await Contact.find(id)
    if (!contact) {
      return response.notFound({ message: 'contact not found' })
    }

    contact.firstname = payload.firstname
    contact.lastname = payload.lastname
    contact.phone = payload.phone

    await contact.save()

    return response.ok(contact)
  }

  public async destroy({ params, response }) {
    const { id }: { id: Number } = params

    const contact: any = await Contact.find(id)
    if (!contact) {
      return response.notFound({ message: 'contact not found' })
    }

    await contact.delete()

    return response.ok({ message: 'contact deleted successfully.' })
  }
}
