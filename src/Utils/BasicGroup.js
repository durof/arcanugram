import UserStore from '../Stores/UserStore';
import BasicGroupStore from '../Stores/BasicGroupStore';

function getBasicGroupStatus(basicGroup){
    if (!basicGroup) return null;

    if (basicGroup.status
        && basicGroup.status['@type'] === 'chatMemberStatusBanned'){
        return 'group is inaccessible';
    }

    const count = basicGroup.member_count;

    if (!count) return '0 members';
    if (count === 1) return '1 member';

    let onlineCount = 0;
    let fullInfo = BasicGroupStore.getFullInfo(basicGroup.id);
    if (fullInfo){
        onlineCount = getBasicGroupOnlineCount(fullInfo);
    }

    if (onlineCount > 1){
        return `${count} members, ${onlineCount} online`;
    }

    return `${count} members`;
}

function getBasicGroupOnlineCount(basicGroupFullInfo) {
    if (!basicGroupFullInfo) return 0;
    if (!basicGroupFullInfo.members) return 0;

    let count = 0;
    for (let i = 0; i < basicGroupFullInfo.members.length; i++){
        let user = UserStore.get(basicGroupFullInfo.members[i].user_id);
        if (user && user.status && user.status['@type'] === 'userStatusOnline'){
            count++;
        }
    }

    return count;
}

export {
    getBasicGroupStatus
}