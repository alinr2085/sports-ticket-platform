package com.example.sportTicket.component;

import com.example.sportTicket.dao.UserDao;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DeletePendingUsers {

    private final UserDao userDao;

    public DeletePendingUsers(UserDao userDao) {
        this.userDao = userDao;
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void cleanupExpiredPendingUsers() {
        userDao.deleteByExpiry(5);
    }

}
