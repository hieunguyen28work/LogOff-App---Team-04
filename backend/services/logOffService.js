import { RequestSTT, TypeHistory } from '../constants/enum'
import { historyRepositories, logOffRepositories } from '../repositories'
import { historyService } from './historyService'
import { notificationService } from './notificationservice'

const create = async (requestLogOff, totalMaster, userId) => {
  try {
    const newLogOff = {
      user: userId,
      masters: totalMaster,
      approval: [],
      usergroups: requestLogOff.usergroups,
      logofffrom: requestLogOff.logofffrom,
      logoffto: requestLogOff.logoffto,
      reason: requestLogOff.reason,
      status: RequestSTT.PENDING,
      quantity: requestLogOff.quantity,
      contentlog: requestLogOff.contentlog,
    }
    const descriptionNoti = 'New log off request'
    await notificationService.createMany(userId, totalMaster, descriptionNoti)
    return logOffRepositories.create(newLogOff)
  } catch (error) {
    throw error
  }
}

const getListRequests = async (totalUser) => {
  try {
    const logOff = await logOffRepositories.getListRequests(totalUser)

    return logOff
  } catch (error) {
    throw error
  }
}

const getListDayOffs = async (totalUser) => {
  try {
    const dayOffs = await logOffRepositories.getListDayOffs(totalUser)

    return dayOffs
  } catch (error) {
    throw error
  }
}

const getOne = async (logOffId) => await logOffRepositories.getOne(logOffId)

const update = async (logOffId, userId, logoffUpdateReq) => {
  const logOff = await logOffRepositories.getOne(logOffId)
  let newHistory = {
    idlogoff: logOff._id,
    user: userId,
    masters: logOff.masters,
    approval: logOff.approval,
    logofffrom: logOff.logofffrom,
    logoffto: logOff.logoffto,
    quantity: logOff.quantity,
    reason: null,
    typelog: null,
    contentlog: logOff.contentlog,
  }
  let changeSTT
  let userTo = []
  let descriptionNoti

  if (logoffUpdateReq.status === RequestSTT.APPROVE) {
    newHistory.typelog = TypeHistory.APPROVE
    newHistory.approval.push(userId)

    await logOffRepositories.addApproval(logOffId, userId)

    const newLogOff = await logOffRepositories.getOne(logOffId)

    userTo.push(logOff.user._id)
    descriptionNoti = ' approved your request'

    if (newLogOff.approval.length === newLogOff.masters.length) {
      changeSTT = {
        status: RequestSTT.APPROVE,
      }
    }
  }

  if (logoffUpdateReq.status === RequestSTT.REJECT) {
    newHistory.typelog = TypeHistory.REJECT
    newHistory.reason = logoffUpdateReq.reason
    newHistory.user = user._id
    userTo.push(logOff.user._id)
    descriptionNoti = ' rejected your request'

    changeSTT = {
      status: RequestSTT.REJECT,
    }
  }

  if (logoffUpdateReq.status === RequestSTT.CHANGE_REQUEST) {
    newHistory.typelog = TypeHistory.CHANGE_REQUEST
    newHistory.reason = logoffUpdateReq.reason
    userTo.push(logOff.user._id)
    descriptionNoti = ' change your request'

    changeSTT = {
      status: RequestSTT.CHANGE_REQUEST,
      approval: [],
    }
  }

  if (logoffUpdateReq.status === RequestSTT.CANCEL) {
    newHistory.typelog = TypeHistory.CANCEL
    newHistory.reason = logoffUpdateReq.reason
    userTo.concat(newHistory.masters)
    descriptionNoti = ' cancel request'

    changeSTT = {
      status: RequestSTT.CANCEL,
    }
  }

  if (logoffUpdateReq.status === RequestSTT.UPDATE) {
    newHistory.typelog = TypeHistory.UPDATE
    newHistory.logofffrom = logoffUpdateReq.logofffrom
    newHistory.logoffto = logoffUpdateReq.logoffto
    newHistory.quantity = logoffUpdateReq.quantity
    newHistory.approval = []
    newHistory.reason = logoffUpdateReq.reason

    userTo.concat(newHistory.masters)
    descriptionNoti = ' updated request'

    changeSTT = {
      status: RequestSTT.PENDING,
      logoffto: logoffUpdateReq.logoffto,
      logofffrom: logoffUpdateReq.logofffrom,
      quantity: logoffUpdateReq.quantity,
      reason: logoffUpdateReq.reason,
      approval: [],
    }
  }

  await historyService.create(newHistory)
  await notificationService.createMany(userId, userTo, descriptionNoti)
  await logOffRepositories.update(logOffId, changeSTT)
  return newHistory
}

export const logOffService = {
  create,
  getListRequests,
  update,
  getOne,
  getListDayOffs,
}
